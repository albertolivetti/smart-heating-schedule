"""Schedule data model and validation.

The year is divided into seasons (date ranges that repeat every year, shared
by all thermostats). For every season a thermostat has programs; a program
is the day schedule of one or more weekdays. Each weekday belongs to at most
one program of a season.

A day schedule is a list of back-to-back blocks covering 00:00-24:00: the
first block starts at 00:00, every block ends where the next one starts and
the last one ends at midnight. A block temperature of ``None`` means heating
off. Days outside every season, and weekdays without a program, are off.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import date, timedelta
from itertools import pairwise
import math
import re
from typing import Any
import uuid

from homeassistant.const import UnitOfTemperature
from homeassistant.util.unit_conversion import TemperatureConverter
import voluptuous as vol

from .const import MINUTES_PER_DAY, SLOT_MINUTES, WEEKDAYS

# Sanity bounds; device specific limits are applied when a block is sent.
MIN_TEMPERATURE = -50.0
MAX_TEMPERATURE = 150.0

# (start minute, temperature) of the default program.
_DEFAULT_DAY_C = [(0, 17.0), (6 * 60 + 30, 20.0), (22 * 60 + 30, 17.0)]
_DEFAULT_DAY_F = [(0, 63.0), (6 * 60 + 30, 68.0), (22 * 60 + 30, 63.0)]

# Meteorological seasons, as Home Assistant's Season integration defines them.
# (id, start, end, color). No program is created for summer by default.
DEFAULT_SEASONS = [
    ("winter", (12, 1), (2, 29), "#2f6fca"),
    ("spring", (3, 1), (5, 31), "#23794a"),
    ("summer", (6, 1), (8, 31), "#b7791f"),
    ("autumn", (9, 1), (11, 30), "#a85b14"),
]
SEASONS_WITHOUT_DEFAULT_PROGRAM = {"summer"}

_SEASON_NAMES = {
    "en": {"winter": "Winter", "spring": "Spring", "summer": "Summer", "autumn": "Autumn"},
    "it": {"winter": "Inverno", "spring": "Primavera", "summer": "Estate", "autumn": "Autunno"},
}
_EVERY_DAY = {"en": "Every day", "it": "Tutti i giorni"}
_DAY_NAMES = {
    "en": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "it": ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
}

# A leap year, so 29 February is a valid season boundary.
_REFERENCE_YEAR = 2024
_COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")
MAX_NAME_LENGTH = 50


def _language(language: str) -> str:
    return "it" if language.lower().startswith("it") else "en"


def new_id() -> str:
    """Return a short random identifier."""
    return uuid.uuid4().hex[:8]


@dataclass(slots=True, frozen=True)
class Block:
    """A time block. ``start`` is in minutes since midnight."""

    start: int
    temperature: float | None

    def as_dict(self) -> dict[str, Any]:
        """Return the JSON representation."""
        return {"start": format_minutes(self.start), "temperature": self.temperature}


OFF_DAY: list[Block] = [Block(0, None)]


@dataclass(slots=True)
class Season:
    """A date range that repeats every year. ``start`` and ``end`` are (month, day)."""

    id: str
    name: str
    start: tuple[int, int]
    end: tuple[int, int]
    color: str | None = None

    def contains(self, day: date) -> bool:
        """Return whether a date falls in this season; ranges may wrap around new year."""
        month_day = (day.month, day.day)
        if self.start <= self.end:
            return self.start <= month_day <= self.end
        return month_day >= self.start or month_day <= self.end

    def as_dict(self) -> dict[str, Any]:
        """Return the JSON representation."""
        return {
            "id": self.id,
            "name": self.name,
            "start": format_month_day(self.start),
            "end": format_month_day(self.end),
            "color": self.color,
        }


@dataclass(slots=True)
class Program:
    """The day schedule of one or more weekdays within a season."""

    id: str
    name: str
    days: list[str]
    blocks: list[Block]

    def as_dict(self) -> dict[str, Any]:
        """Return the JSON representation."""
        return {
            "id": self.id,
            "name": self.name,
            "days": list(self.days),
            "blocks": [block.as_dict() for block in self.blocks],
        }


@dataclass(slots=True)
class RoomSchedule:
    """The schedule of one climate entity: its programs per season id."""

    entity_id: str
    enabled: bool
    programs: dict[str, list[Program]] = field(default_factory=dict)

    def program_for(self, season_id: str, weekday: int) -> Program | None:
        """Return the program of a season that runs on a weekday (0 = Monday)."""
        day = WEEKDAYS[weekday]
        for program in self.programs.get(season_id, []):
            if day in program.days:
                return program
        return None

    def as_dict(self) -> dict[str, Any]:
        """Return the JSON representation."""
        return {
            "entity_id": self.entity_id,
            "enabled": self.enabled,
            "programs": {
                season_id: [program.as_dict() for program in programs]
                for season_id, programs in self.programs.items()
            },
        }


def season_for(seasons: Iterable[Season], day: date) -> Season | None:
    """Return the season a date falls in, if any."""
    return next((season for season in seasons if season.contains(day)), None)


@dataclass(slots=True, frozen=True)
class DayPlan:
    """What a room does on a date: its blocks and where they come from."""

    blocks: list[Block]
    season: Season | None
    program: Program | None


def day_plan(room: RoomSchedule, seasons: list[Season], day: date) -> DayPlan:
    """Return the blocks of a room on a date; off outside seasons and programs."""
    season = season_for(seasons, day)
    if season is None:
        return DayPlan(OFF_DAY, None, None)
    program = room.program_for(season.id, day.weekday())
    if program is None:
        return DayPlan(OFF_DAY, season, None)
    return DayPlan(program.blocks, season, program)


# ----------------------------------------------------------------------
# Parsing and formatting


def parse_time(value: str) -> int:
    """Parse ``HH:MM`` into minutes since midnight."""
    hours, minutes = value.split(":")
    return int(hours) * 60 + int(minutes)


def format_minutes(minutes: int) -> str:
    """Format minutes since midnight as ``HH:MM``."""
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def parse_month_day(value: str) -> tuple[int, int]:
    """Parse ``MM-DD`` into (month, day)."""
    month, day = value.split("-")
    return int(month), int(day)


def format_month_day(value: tuple[int, int]) -> str:
    """Format (month, day) as ``MM-DD``."""
    return f"{value[0]:02d}-{value[1]:02d}"


# ----------------------------------------------------------------------
# Validation


def _validate_time(value: Any) -> str:
    if not isinstance(value, str):
        raise vol.Invalid("time must be a string in HH:MM format")
    try:
        minutes = parse_time(value)
    except ValueError as err:
        raise vol.Invalid(f"invalid time: {value}") from err
    if not 0 <= minutes < MINUTES_PER_DAY or len(value) != 5:
        raise vol.Invalid(f"invalid time: {value}")
    if minutes % SLOT_MINUTES:
        raise vol.Invalid(f"time must be on a {SLOT_MINUTES} minute boundary: {value}")
    return value


def _validate_temperature(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, bool):
        raise vol.Invalid("temperature must be a number or null")
    try:
        temperature = float(value)
    except (TypeError, ValueError) as err:
        raise vol.Invalid("temperature must be a number or null") from err
    if not math.isfinite(temperature) or not (MIN_TEMPERATURE <= temperature <= MAX_TEMPERATURE):
        raise vol.Invalid(f"temperature out of range: {value}")
    return round(temperature, 2)


def _validate_day(blocks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not blocks:
        raise vol.Invalid("a day needs at least one time block")
    starts = [parse_time(block["start"]) for block in blocks]
    if starts[0] != 0:
        raise vol.Invalid("the first time block must start at 00:00")
    for previous, current in pairwise(starts):
        if current - previous < SLOT_MINUTES:
            raise vol.Invalid(
                f"time blocks must be in order and at least {SLOT_MINUTES} minutes long"
            )
    return blocks


def _validate_month_day(value: Any) -> str:
    if not isinstance(value, str) or len(value) != 5 or value[2] != "-":
        raise vol.Invalid(f"date must be MM-DD: {value}")
    try:
        month, day = parse_month_day(value)
        date(_REFERENCE_YEAR, month, day)
    except ValueError as err:
        raise vol.Invalid(f"invalid date: {value}") from err
    return value


def _validate_name(value: Any) -> str:
    name = vol.Coerce(str)(value).strip()
    if not name or len(name) > MAX_NAME_LENGTH:
        raise vol.Invalid(f"a name needs 1 to {MAX_NAME_LENGTH} characters")
    return name


def _validate_id(value: Any) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", value):
        raise vol.Invalid(f"invalid id: {value}")
    return value


def _validate_color(value: Any) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str) or not _COLOR.match(value):
        raise vol.Invalid(f"color must be #RRGGBB: {value}")
    return value.lower()


def _validate_weekdays(days: list[str]) -> list[str]:
    if len(set(days)) != len(days):
        raise vol.Invalid("a weekday appears twice in a program")
    return sorted(days, key=WEEKDAYS.index)


BLOCK_SCHEMA = vol.Schema(
    {
        vol.Required("start"): _validate_time,
        vol.Required("temperature"): _validate_temperature,
    }
)
DAY_SCHEMA = vol.All([BLOCK_SCHEMA], _validate_day)

PROGRAM_SCHEMA = vol.Schema(
    {
        vol.Required("id"): _validate_id,
        vol.Required("name"): _validate_name,
        vol.Required("days"): vol.All([vol.In(WEEKDAYS)], _validate_weekdays),
        vol.Required("blocks"): DAY_SCHEMA,
    }
)


def _validate_programs(programs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    ids = [program["id"] for program in programs]
    if len(set(ids)) != len(ids):
        raise vol.Invalid("program ids must be unique within a season")
    seen: set[str] = set()
    for program in programs:
        for day in program["days"]:
            if day in seen:
                raise vol.Invalid(f"{day} is in more than one program")
            seen.add(day)
    return programs


PROGRAMS_SCHEMA = vol.All([PROGRAM_SCHEMA], _validate_programs)

SEASON_SCHEMA = vol.Schema(
    {
        vol.Required("id"): _validate_id,
        vol.Required("name"): _validate_name,
        vol.Required("start"): _validate_month_day,
        vol.Required("end"): _validate_month_day,
        vol.Optional("color"): _validate_color,
    }
)


def _validate_seasons(seasons: list[dict[str, Any]]) -> list[dict[str, Any]]:
    ids = [season["id"] for season in seasons]
    if len(set(ids)) != len(ids):
        raise vol.Invalid("season ids must be unique")
    built = [_season(season) for season in seasons]
    day = date(_REFERENCE_YEAR, 1, 1)
    while day.year == _REFERENCE_YEAR:
        matches = [season.name for season in built if season.contains(day)]
        if len(matches) > 1:
            raise vol.Invalid(
                f"seasons overlap on {format_month_day((day.month, day.day))}: "
                + ", ".join(matches)
            )
        day += timedelta(days=1)
    return seasons


SEASONS_SCHEMA = vol.All([SEASON_SCHEMA], _validate_seasons)


# ----------------------------------------------------------------------
# Building from JSON


def _season(data: dict[str, Any]) -> Season:
    return Season(
        id=data["id"],
        name=data["name"],
        start=parse_month_day(data["start"]),
        end=parse_month_day(data["end"]),
        color=data.get("color"),
    )


def day_from_dict(blocks: list[dict[str, Any]]) -> list[Block]:
    """Build blocks from validated JSON."""
    return [Block(parse_time(block["start"]), block["temperature"]) for block in blocks]


def seasons_from_list(data: Any) -> list[Season]:
    """Validate and build the seasons."""
    return [_season(season) for season in SEASONS_SCHEMA(data)]


def programs_from_list(data: Any) -> list[Program]:
    """Validate and build the programs of one season."""
    return [
        Program(
            id=program["id"],
            name=program["name"],
            days=program["days"],
            blocks=day_from_dict(program["blocks"]),
        )
        for program in PROGRAMS_SCHEMA(data)
    ]


def programs_by_season(data: Any) -> dict[str, list[Program]]:
    """Validate and build programs keyed by season id."""
    if not isinstance(data, dict):
        raise vol.Invalid("programs must be an object keyed by season id")
    return {_validate_id(season_id): programs_from_list(raw) for season_id, raw in data.items()}


def room_from_dict(data: dict[str, Any]) -> RoomSchedule:
    """Validate and build a room schedule from JSON."""
    return RoomSchedule(
        entity_id=data["entity_id"],
        enabled=bool(data.get("enabled", True)),
        programs=programs_by_season(data.get("programs", {})),
    )


# ----------------------------------------------------------------------
# Defaults


def default_seasons(language: str) -> list[Season]:
    """Return the meteorological seasons, named in a language."""
    names = _SEASON_NAMES[_language(language)]
    return [
        Season(id=season_id, name=names[season_id], start=start, end=end, color=color)
        for season_id, start, end, color in DEFAULT_SEASONS
    ]


def default_blocks(unit: str) -> list[Block]:
    """Return the blocks of a new program."""
    template = _DEFAULT_DAY_F if unit == UnitOfTemperature.FAHRENHEIT else _DEFAULT_DAY_C
    return [Block(start, temperature) for start, temperature in template]


def default_program(unit: str, language: str) -> Program:
    """Return a program that runs every day."""
    return Program(
        id=new_id(),
        name=_EVERY_DAY[_language(language)],
        days=list(WEEKDAYS),
        blocks=default_blocks(unit),
    )


def default_room(entity_id: str, unit: str, seasons: list[Season], language: str) -> RoomSchedule:
    """Return a new room schedule: every season but summer runs a default program."""
    return RoomSchedule(
        entity_id=entity_id,
        enabled=True,
        programs={
            season.id: [default_program(unit, language)]
            for season in seasons
            if season.id not in SEASONS_WITHOUT_DEFAULT_PROGRAM
        },
    )


def programs_from_week(days: dict[str, list[Block]], language: str) -> list[Program]:
    """Group the days of a week schedule with identical blocks into programs."""
    groups: list[tuple[list[Block], list[str]]] = []
    for day in WEEKDAYS:
        blocks = days[day]
        for group_blocks, group_days in groups:
            if group_blocks == blocks:
                group_days.append(day)
                break
        else:
            groups.append((blocks, [day]))
    lang = _language(language)
    programs = []
    for blocks, group_days in groups:
        if len(group_days) == len(WEEKDAYS):
            name = _EVERY_DAY[lang]
        else:
            name = ", ".join(_DAY_NAMES[lang][WEEKDAYS.index(day)] for day in group_days)
        programs.append(Program(id=new_id(), name=name, days=group_days, blocks=list(blocks)))
    return programs


def convert_room(room: RoomSchedule, from_unit: str, to_unit: str) -> RoomSchedule:
    """Convert all temperatures of a room to another unit.

    Values are rounded to 0.5 °C or 1 °F, the usual thermostat steps.
    """
    step = 1.0 if to_unit == UnitOfTemperature.FAHRENHEIT else 0.5

    def convert(value: float | None) -> float | None:
        if value is None:
            return None
        converted = TemperatureConverter.convert(value, from_unit, to_unit)
        return round(round(converted / step) * step, 2)

    return RoomSchedule(
        entity_id=room.entity_id,
        enabled=room.enabled,
        programs={
            season_id: [
                Program(
                    id=program.id,
                    name=program.name,
                    days=list(program.days),
                    blocks=[
                        Block(block.start, convert(block.temperature)) for block in program.blocks
                    ],
                )
                for program in programs
            ]
            for season_id, programs in room.programs.items()
        },
    )
