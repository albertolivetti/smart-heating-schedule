"""Persistent storage for seasons, schedules and scheduler runtime state."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
import voluptuous as vol

from .const import (
    RUNTIME_STORAGE_KEY,
    RUNTIME_STORAGE_VERSION,
    SAVE_DELAY,
    STORAGE_KEY,
    STORAGE_VERSION,
    WEEKDAYS,
)
from .models import (
    SEASONS_WITHOUT_DEFAULT_PROGRAM,
    RoomSchedule,
    Season,
    convert_room,
    day_from_dict,
    default_seasons,
    programs_from_week,
    room_from_dict,
    seasons_from_list,
)

_LOGGER = logging.getLogger(__name__)


class _ScheduleFile(Store[dict[str, Any]]):
    """The schedules file, with migration from the home/away format of version 1."""

    def __init__(self, hass: HomeAssistant) -> None:
        super().__init__(hass, STORAGE_VERSION, STORAGE_KEY)

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        if old_major_version >= 2:
            return old_data
        language = self.hass.config.language
        seasons = default_seasons(language)
        rooms: dict[str, Any] = {}
        for entity_id, raw in old_data.get("rooms", {}).items():
            try:
                days = {day: day_from_dict(raw["home"]["days"][day]) for day in WEEKDAYS}
            except (KeyError, TypeError, ValueError) as err:
                _LOGGER.error("Dropping unreadable schedule of %s: %s", entity_id, err)
                continue
            rooms[entity_id] = RoomSchedule(
                entity_id=entity_id,
                enabled=bool(raw.get("enabled", True)),
                programs={
                    season.id: programs_from_week(days, language)
                    for season in seasons
                    if season.id not in SEASONS_WITHOUT_DEFAULT_PROGRAM
                },
            ).as_dict()
        _LOGGER.info("Moved %d weekly schedules into seasons", len(rooms))
        return {
            "unit": old_data.get("unit"),
            "seasons": [season.as_dict() for season in seasons],
            "rooms": rooms,
        }


class ScheduleStore:
    """Holds seasons and room schedules (user data) and runtime state.

    They are kept in two files so frequent runtime writes never touch the
    schedules the user edited.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the store."""
        self.hass = hass
        self._store = _ScheduleFile(hass)
        self._runtime_store: Store[dict[str, Any]] = Store(
            hass, RUNTIME_STORAGE_VERSION, RUNTIME_STORAGE_KEY
        )
        self.unit: str = hass.config.units.temperature_unit
        self.seasons: list[Season] = []
        self.rooms: dict[str, RoomSchedule] = {}
        self.away: bool = False
        # entity_id -> {"key": target key, "mode": ..., "temperature": ...}
        self.last_applied: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        """Load data from disk, converting temperatures if the unit system changed."""
        data = await self._store.async_load()
        if data is None:
            self.seasons = default_seasons(self.hass.config.language)
            self.async_schedule_save()
            data = {}
        else:
            try:
                self.seasons = seasons_from_list(data.get("seasons", []))
            except vol.Invalid as err:
                _LOGGER.error("Stored seasons are invalid, using the defaults: %s", err)
                self.seasons = default_seasons(self.hass.config.language)

        stored_unit = data.get("unit") or self.unit
        converted = False
        for entity_id, raw in data.get("rooms", {}).items():
            try:
                room = room_from_dict(raw)
            except (vol.Invalid, KeyError) as err:
                _LOGGER.error("Ignoring invalid stored schedule for %s: %s", entity_id, err)
                continue
            if stored_unit != self.unit:
                room = convert_room(room, stored_unit, self.unit)
                converted = True
            self.rooms[room.entity_id] = room

        runtime = await self._runtime_store.async_load() or {}
        self.away = bool(runtime.get("away", False))
        if not converted:
            self.last_applied = dict(runtime.get("last_applied", {}))
        else:
            _LOGGER.info("Converted schedules from %s to %s", stored_unit, self.unit)
            self.async_schedule_save()

    def async_schedule_save(self) -> None:
        """Save the schedules soon."""
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)

    def async_schedule_runtime_save(self) -> None:
        """Save the runtime state soon."""
        self._runtime_store.async_delay_save(self._runtime_to_save, SAVE_DELAY)

    def _data_to_save(self) -> dict[str, Any]:
        return {
            "unit": self.unit,
            "seasons": [season.as_dict() for season in self.seasons],
            "rooms": {entity_id: room.as_dict() for entity_id, room in self.rooms.items()},
        }

    def _runtime_to_save(self) -> dict[str, Any]:
        return {"away": self.away, "last_applied": self.last_applied}

    async def async_flush(self) -> None:
        """Write both files now, e.g. before the entry is reloaded."""
        await self._store.async_save(self._data_to_save())
        await self._runtime_store.async_save(self._runtime_to_save())

    async def async_remove(self) -> None:
        """Delete the files from disk."""
        await self._store.async_remove()
        await self._runtime_store.async_remove()
