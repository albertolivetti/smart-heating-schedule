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

type BlocksForDate = Callable[[date], list[Block]]


@dataclass(slots=True, frozen=True)
class Segment:
    """A stretch of time with one target temperature.

    Back-to-back blocks with the same temperature are merged, also across
    midnight, so a segment only ends when the temperature really changes.
    ``start`` and ``end`` are ``None`` when the temperature does not change
    within the window.
    """

    start: datetime | None
    end: datetime | None
    temperature: float | None
    next_temperature: float | None

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


def _boundaries(
    blocks_for_date: BlocksForDate, first: date, days: int
) -> list[tuple[datetime, float | None]]:
    """Return (start, temperature) of every block in a range, merged on equal temperature."""
    merged: list[tuple[datetime, float | None]] = []
    for offset in range(days):
        day = first + timedelta(days=offset)
        for block in blocks_for_date(day):
            if merged and merged[-1][1] == block.temperature:
                continue
            merged.append((_local_datetime(day, block.start), block.temperature))
    return merged


def segment_at(blocks_for_date: BlocksForDate, when: datetime) -> Segment:
    """Return the segment active at ``when``."""
    local = dt_util.as_local(when)
    # Compare timestamps: datetimes in the same zone compare by wall clock,
    # which is wrong during the repeated hour when DST ends.
    timestamp = when.timestamp()
    first = local.date() - timedelta(days=_WINDOW_DAYS)
    boundaries = _boundaries(blocks_for_date, first, 2 * _WINDOW_DAYS + 1)

    if len(boundaries) == 1:
        return Segment(None, None, boundaries[0][1], None)

    for index in range(len(boundaries) - 1, -1, -1):
        start, temperature = boundaries[index]
        if start.timestamp() <= timestamp:
            # The first boundary is just the start of the window, not a change:
            # report it as unknown so the segment key stays stable from day to day.
            real_start = start if index > 0 else None
            if index + 1 == len(boundaries):
                # No change until the end of the window.
                return Segment(real_start, None, temperature, None)
            end, next_temperature = boundaries[index + 1]
            return Segment(real_start, end, temperature, next_temperature)

    # Before the first boundary: the window starts with this temperature.
    return Segment(None, boundaries[0][0], boundaries[0][1], boundaries[1][1])
