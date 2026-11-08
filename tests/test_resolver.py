"""Tests for resolving the active segment."""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from homeassistant.util import dt as dt_util
import pytest

from custom_components.smart_heating_schedule.models import Block
from custom_components.smart_heating_schedule.resolver import BlocksForDate, segment_at

TZ = ZoneInfo("Europe/Amsterdam")


@pytest.fixture(autouse=True)
def amsterdam() -> None:
    """Resolve in a time zone with DST."""
    original = dt_util.get_default_time_zone()
    dt_util.set_default_time_zone(TZ)
    yield
    dt_util.set_default_time_zone(original)


HOME = [Block(0, 18), Block(7 * 60, 20), Block(22 * 60, 18)]


class Week:
    """A weekly schedule as a blocks-for-date function; ``days`` keyed 0 (Monday) to 6."""

    def __init__(self, blocks: list[Block]) -> None:
        self.days = {weekday: list(blocks) for weekday in range(7)}

    def __call__(self, day) -> list[Block]:
        return self.days[day.weekday()]


def every_day(blocks: list[Block]) -> BlocksForDate:
    return Week(blocks)


def home_week() -> Week:
    return Week(HOME)


def at(*args: int) -> datetime:
    return datetime(*args, tzinfo=TZ)


def test_middle_of_block() -> None:
    week = home_week()  # 00:00 18, 07:00 20, 22:00 18 every day
    segment = segment_at(week, at(2026, 10, 26, 12, 0))
    assert segment.start == at(2026, 10, 26, 7, 0)
    assert segment.end == at(2026, 10, 26, 22, 0)
    assert segment.temperature == 20
    assert segment.next_temperature == 18


def test_merges_across_midnight() -> None:
    week = home_week()
    segment = segment_at(week, at(2026, 10, 27, 1, 0))
    # 22:00 18° continues into 00:00-07:00 18° of the next day.
    assert segment.start == at(2026, 10, 26, 22, 0)
    assert segment.end == at(2026, 10, 27, 7, 0)
    assert segment_at(week, at(2026, 10, 26, 23, 0)).key == segment.key


def test_boundary_is_inclusive_start() -> None:
    week = home_week()
    assert segment_at(week, at(2026, 10, 26, 7, 0)).temperature == 20
    assert segment_at(week, at(2026, 10, 26, 6, 59)).temperature == 18


def test_constant_week() -> None:
    segment = segment_at(every_day([Block(0, 16)]), at(2026, 10, 26, 12, 0))
    assert segment.start is None
    assert segment.end is None
    assert segment.temperature == 16


def test_change_once_a_week() -> None:
    week = every_day([Block(0, 18)])
    week.days[0] = [Block(0, 18), Block(600, None)]
    # Thursday: the segment started after Monday's off block and lasts until next Monday.
    segment = segment_at(week, at(2026, 10, 29, 12, 0))  # Thursday
    assert segment.start == at(2026, 10, 27, 0, 0)
    assert segment.end == at(2026, 11, 2, 10, 0)
    assert segment.next_temperature is None


def test_each_day_has_its_own_blocks() -> None:
    week = home_week()
    week.days[5] = [Block(0, 21)]
    assert segment_at(week, at(2026, 10, 31, 3, 0)).temperature == 21  # Saturday
    assert segment_at(week, at(2026, 10, 30, 23, 0)).end == at(2026, 10, 31, 0, 0)


def test_dst_fall_back() -> None:
    week = every_day([Block(0, 18), Block(150, 20), Block(240, 18)])
    # 25 October 2026: clocks go back at 03:00 CEST to 02:00 CET.
    segment = segment_at(week, at(2026, 10, 25, 3, 30))
    assert segment.temperature == 20
    assert segment.end == at(2026, 10, 25, 4, 0)
    # The repeated hour (second 02:15) is after the first 02:30 boundary.
    repeated = segment_at(week, datetime(2026, 10, 25, 2, 15, fold=1, tzinfo=TZ))
    assert repeated.temperature == 20
    assert segment.end.timestamp() - repeated.start.timestamp() == 2.5 * 3600


def test_dst_spring_forward() -> None:
    week = every_day([Block(0, 18), Block(150, 20), Block(240, 18)])
    # 29 March 2026: 02:00-03:00 does not exist. The 02:30 boundary must still
    # come before the 04:00 one and segments must be in order.
    before = segment_at(week, at(2026, 3, 29, 1, 0))
    assert before.end is not None
    assert before.end < at(2026, 3, 29, 4, 0)
    later = segment_at(week, before.end + timedelta(minutes=1))
    assert later.temperature == 20
    assert later.end == at(2026, 3, 29, 4, 0)


def test_season_change_within_the_window() -> None:
    from datetime import date

    def seasonal(day: date) -> list[Block]:
        return HOME if day >= date(2026, 9, 1) else [Block(0, None)]

    # Off all of August until autumn starts on 1 September.
    segment = segment_at(seasonal, at(2026, 8, 28, 12, 0))
    assert segment.start is None  # off since before the window
    assert segment.end == at(2026, 9, 1, 0, 0)
    assert segment.temperature is None
    assert segment.next_temperature == 18
    # The key does not change from day to day while nothing happens.
    assert segment_at(seasonal, at(2026, 8, 29, 12, 0)).key == segment.key


def test_no_change_in_the_window() -> None:
    segment = segment_at(lambda day: [Block(0, None)], at(2026, 7, 1, 12, 0))
    assert segment.start is None
    assert segment.end is None


def test_key_is_stable_through_a_long_stretch() -> None:
    from datetime import date

    def seasonal(day: date) -> list[Block]:
        return [Block(0, None)] if date(2026, 6, 1) <= day <= date(2026, 8, 31) else HOME

    keys = {segment_at(seasonal, at(2026, 6, day, 12, 0)).key for day in range(2, 30)}
    assert len(keys) == 1
    segment = segment_at(seasonal, at(2026, 6, 20, 12, 0))
    assert segment.start == at(2026, 6, 1, 0, 0)


def test_names_split_equal_temperatures() -> None:
    week = every_day(
        [Block(0, 18), Block(6 * 60, 20, "Risveglio"), Block(8 * 60, 20), Block(22 * 60, 18)]
    )
    segment = segment_at(week, at(2026, 10, 26, 7, 0))
    assert segment.start == at(2026, 10, 26, 6, 0)
    assert segment.end == at(2026, 10, 26, 8, 0)
    assert segment.name == "Risveglio"
    assert segment.next_temperature == 20
    assert segment.next_name is None


def test_same_name_and_temperature_merge() -> None:
    week = every_day([Block(0, 18, "Notte"), Block(7 * 60, 20), Block(22 * 60, 18, "Notte")])
    segment = segment_at(week, at(2026, 10, 27, 3, 0))
    assert segment.start == at(2026, 10, 26, 22, 0)
    assert segment.end == at(2026, 10, 27, 7, 0)
    assert segment.name == "Notte"
