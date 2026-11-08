"""Resolve which temperature a schedule wants at a point in time."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta

from homeassistant.util import dt as dt_util

from .models import Block

# Seasons change the blocks from one date to the next, so the window looks a
# week back and ahead. When nothing changes in it, the segment has no start
# or end and the engine checks again the next day.
_WINDOW_DAYS = 8
# How far back to look for the real start of a stretch that began before the window.
_LOOKBACK_DAYS = 400

type BlocksForDate = Callable[[date], list[Block]]


@dataclass(slots=True, frozen=True)
class Segment:
    """A stretch of time with one target temperature.

    Back-to-back blocks with the same temperature and name are merged, also
    across midnight, so a segment only ends when the block really changes.
    ``start`` and ``end`` are ``None`` when the temperature does not change
    within the window.
    """

    start: datetime | None
    end: datetime | None
    temperature: float | None
    next_temperature: float | None
    name: str | None = None
    next_name: str | None = None

    @property
    def key(self) -> str:
        """Return a stable identifier for this segment."""
        start = self.start.isoformat() if self.start else "always"
        return f"{start}|{self.temperature}"


def _local_datetime(day: date, minutes: int) -> datetime:
    return datetime.combine(
        day,
        time(minutes // 60, minutes % 60),
        tzinfo=dt_util.get_default_time_zone(),
    )


type Value = tuple[float | None, str | None]


def _value(block: Block) -> Value:
    return block.temperature, block.name


def _boundaries(
    blocks_for_date: BlocksForDate, first: date, days: int
) -> list[tuple[datetime, Value]]:
    """Return (start, (temperature, name)) of every block in a range, merging equal ones."""
    merged: list[tuple[datetime, Value]] = []
    for offset in range(days):
        day = first + timedelta(days=offset)
        for block in blocks_for_date(day):
            if merged and merged[-1][1] == _value(block):
                continue
            merged.append((_local_datetime(day, block.start), _value(block)))
    return merged


def _start_before(blocks_for_date: BlocksForDate, first: date, value: Value) -> datetime | None:
    """Return when the stretch of ``value`` running at midnight on ``first`` began.

    Using the real start (instead of the window's first day) keeps the segment
    key the same from one day to the next, so long stretches are not re-sent.
    """
    for back in range(1, _LOOKBACK_DAYS):
        day = first - timedelta(days=back)
        blocks = blocks_for_date(day)
        for index in range(len(blocks) - 1, -1, -1):
            if _value(blocks[index]) != value:
                if index + 1 < len(blocks):
                    return _local_datetime(day, blocks[index + 1].start)
                return _local_datetime(day + timedelta(days=1), 0)
    return None


def segment_at(blocks_for_date: BlocksForDate, when: datetime) -> Segment:
    """Return the segment active at ``when``."""
    local = dt_util.as_local(when)
    # Compare timestamps: datetimes in the same zone compare by wall clock,
    # which is wrong during the repeated hour when DST ends.
    timestamp = when.timestamp()
    first = local.date() - timedelta(days=_WINDOW_DAYS)
    boundaries = _boundaries(blocks_for_date, first, 2 * _WINDOW_DAYS + 1)

    if len(boundaries) == 1:
        value = boundaries[0][1]
        return Segment(_start_before(blocks_for_date, first, value), None, *_now(value))

    for index in range(len(boundaries) - 1, -1, -1):
        start, value = boundaries[index]
        if start.timestamp() <= timestamp:
            # The first boundary is just the start of the window, not a change.
            real_start = start if index > 0 else _start_before(blocks_for_date, first, value)
            if index + 1 == len(boundaries):
                # No change until the end of the window.
                return Segment(real_start, None, *_now(value))
            end, next_value = boundaries[index + 1]
            return Segment(real_start, end, *_now_and_next(value, next_value))

    # Before the first boundary: the window starts with this block.
    return Segment(None, boundaries[0][0], *_now_and_next(boundaries[0][1], boundaries[1][1]))


def _now(value: Value) -> tuple[float | None, None, str | None, None]:
    return value[0], None, value[1], None


def _now_and_next(
    value: Value, next_value: Value
) -> tuple[float | None, float | None, str | None, str | None]:
    return value[0], next_value[0], value[1], next_value[1]
