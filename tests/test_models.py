"""Tests for the schedule model."""

from __future__ import annotations

from datetime import date

import pytest
import voluptuous as vol

from custom_components.smart_heating_schedule.models import (
    DAY_SCHEMA,
    Block,
    Season,
    convert_room,
    day_plan,
    default_room,
    default_seasons,
    programs_by_season,
    programs_from_week,
    room_from_dict,
    season_for,
    seasons_from_list,
)

SEASONS = default_seasons("it")


def day(*blocks: tuple[str, float | None]) -> list[dict]:
    return [{"start": start, "temperature": temperature} for start, temperature in blocks]


def program(pid: str, days: list[str], blocks: list[dict] | None = None) -> dict:
    return {"id": pid, "name": pid, "days": days, "blocks": blocks or day(("00:00", 18))}


def test_valid_day() -> None:
    assert DAY_SCHEMA(day(("00:00", 18), ("07:15", 20.5), ("23:45", None)))


@pytest.mark.parametrize(
    "blocks",
    [
        [],
        day(("00:15", 18)),
        day(("00:00", 18), ("07:00", 20), ("06:00", 18)),
        day(("00:00", 18), ("07:00", 20), ("07:00", 18)),
        day(("00:00", 18), ("07:10", 20)),
        day(("00:00", 18), ("24:00", 20)),
        day(("00:00", 18), ("7:00", 20)),
        day(("00:00", "warm")),
        day(("00:00", True)),
        day(("00:00", 500)),
        day(("00:00", float("nan"))),
    ],
)
def test_invalid_day(blocks: list[dict]) -> None:
    with pytest.raises(vol.Invalid):
        DAY_SCHEMA(blocks)


def test_default_seasons_cover_the_year_in_italian() -> None:
    assert [s.name for s in SEASONS] == ["Inverno", "Primavera", "Estate", "Autunno"]
    assert season_for(SEASONS, date(2027, 2, 28)).id == "winter"
    assert season_for(SEASONS, date(2028, 2, 29)).id == "winter"
    assert season_for(SEASONS, date(2027, 3, 1)).id == "spring"
    assert season_for(SEASONS, date(2026, 12, 31)).id == "winter"
    assert season_for(SEASONS, date(2026, 11, 8)).id == "autumn"


def test_season_wrapping_new_year() -> None:
    season = Season("heating", "Riscaldamento", (10, 15), (4, 15))
    assert season.contains(date(2026, 10, 15))
    assert season.contains(date(2027, 1, 10))
    assert season.contains(date(2027, 4, 15))
    assert not season.contains(date(2027, 4, 16))
    assert not season.contains(date(2026, 10, 14))


def test_seasons_validation() -> None:
    seasons = seasons_from_list(
        [
            {"id": "a", "name": "Autunno", "start": "10-15", "end": "11-14", "color": "#A85B14"},
            {"id": "b", "name": "Inverno", "start": "11-15", "end": "03-15"},
        ]
    )
    assert seasons[0].color == "#a85b14"
    assert seasons[1].as_dict()["end"] == "03-15"

    for bad in (
        [{"id": "a", "name": "A", "start": "10-15", "end": "11-14"}] * 2,  # duplicate id
        [
            {"id": "a", "name": "A", "start": "10-15", "end": "11-14"},
            {"id": "b", "name": "B", "start": "11-14", "end": "12-01"},  # overlap
        ],
        [{"id": "a", "name": "A", "start": "02-30", "end": "03-01"}],
        [{"id": "a", "name": "A", "start": "1-5", "end": "03-01"}],
        [{"id": "a", "name": "", "start": "01-05", "end": "03-01"}],
        [{"id": "a b", "name": "A", "start": "01-05", "end": "03-01"}],
        [{"id": "a", "name": "A", "start": "01-05", "end": "03-01", "color": "red"}],
    ):
        with pytest.raises(vol.Invalid):
            seasons_from_list(bad)


def test_programs_validation() -> None:
    programs = programs_by_season(
        {"winter": [program("p1", ["sun", "mon"]), program("p2", ["sat"])]}
    )
    assert programs["winter"][0].days == ["mon", "sun"]  # sorted

    with pytest.raises(vol.Invalid):  # a day in two programs
        programs_by_season({"winter": [program("p1", ["mon"]), program("p2", ["mon"])]})
    with pytest.raises(vol.Invalid):  # duplicate program id
        programs_by_season({"winter": [program("p1", ["mon"]), program("p1", ["tue"])]})
    with pytest.raises(vol.Invalid):
        programs_by_season({"winter": [program("p1", ["funday"])]})
    with pytest.raises(vol.Invalid):
        programs_by_season({"winter": [program("p1", ["mon"], day(("01:00", 18)))]})


def test_round_trip_and_day_plan() -> None:
    room = default_room("climate.caldaia", "°C", SEASONS, "it")
    assert set(room.programs) == {"winter", "spring", "autumn"}
    assert room.programs["winter"][0].name == "Tutti i giorni"
    assert room_from_dict(room.as_dict()) == room

    plan = day_plan(room, SEASONS, date(2026, 11, 8))
    assert plan.season.id == "autumn"
    assert [b.temperature for b in plan.blocks] == [17, 20, 17]
    summer = day_plan(room, SEASONS, date(2026, 7, 1))
    assert summer.season.id == "summer"
    assert summer.program is None
    assert summer.blocks == [Block(0, None)]
    outside = day_plan(room, [Season("x", "X", (1, 1), (1, 2))], date(2026, 7, 1))
    assert outside.season is None


def test_programs_from_week_groups_equal_days() -> None:
    weekday = [Block(0, 18), Block(420, 20)]
    weekend = [Block(0, 19)]
    days = {d: weekday for d in ("mon", "tue", "wed", "thu", "fri")} | {
        "sat": weekend,
        "sun": weekend,
    }
    programs = programs_from_week(days, "it")
    assert [p.days for p in programs] == [["mon", "tue", "wed", "thu", "fri"], ["sat", "sun"]]
    assert programs[1].name == "Sab, Dom"
    every = programs_from_week({d: weekend for d in days}, "en")
    assert every[0].name == "Every day"


def test_convert_room() -> None:
    room = default_room("climate.a", "°C", SEASONS, "en")
    room.programs["winter"][0].blocks.append(Block(23 * 60, None))
    converted = convert_room(room, "°C", "°F")
    assert [b.temperature for b in converted.programs["winter"][0].blocks] == [63, 68, 63, None]
    back = convert_room(converted, "°F", "°C")
    assert [b.temperature for b in back.programs["winter"][0].blocks] == [17, 20, 17, None]
