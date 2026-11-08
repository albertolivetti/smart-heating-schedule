"""Sensors for the scheduled temperature and the active season."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import SmartHeatingConfigEntry
from .const import (
    ATTR_AWAY,
    ATTR_BLOCK_END,
    ATTR_BLOCK_NAME,
    ATTR_BLOCK_START,
    ATTR_HEATING_OFF,
    ATTR_LAST_ERROR,
    ATTR_NEXT_BLOCK_NAME,
    ATTR_NEXT_TEMPERATURE,
    ATTR_OVERRIDDEN,
    ATTR_PENDING,
    ATTR_PROGRAM,
    ATTR_SEASON,
    SIGNAL_ROOM_ADDED,
)
from .engine import ScheduleEngine
from .entity import GlobalEntity, RoomEntity
from .models import format_month_day, season_for


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SmartHeatingConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the sensors."""
    engine = entry.runtime_data
    async_add_entities(
        [
            ActiveSeasonSensor(engine),
            *(ScheduledTemperatureSensor(engine, entity_id) for entity_id in engine.store.rooms),
        ]
    )

    @callback
    def _room_added(entity_id: str) -> None:
        async_add_entities([ScheduledTemperatureSensor(engine, entity_id)])

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_ROOM_ADDED, _room_added))


class ActiveSeasonSensor(GlobalEntity, SensorEntity):
    """The season today falls in; unknown outside every season."""

    def __init__(self, engine: ScheduleEngine) -> None:
        """Initialize the sensor."""
        super().__init__(engine, "active_season")

    @property
    def native_value(self) -> str | None:
        """Return the name of today's season."""
        season = season_for(self.engine.store.seasons, dt_util.now().date())
        return season.name if season else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the season id and dates."""
        season = season_for(self.engine.store.seasons, dt_util.now().date())
        return {
            "season_id": season.id if season else None,
            "start": format_month_day(season.start) if season else None,
            "end": format_month_day(season.end) if season else None,
        }


class ScheduledTemperatureSensor(RoomEntity, SensorEntity):
    """The temperature the schedule currently asks for."""

    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_suggested_display_precision = 1

    def __init__(self, engine: ScheduleEngine, climate_entity_id: str) -> None:
        """Initialize the sensor."""
        super().__init__(engine, climate_entity_id, "scheduled_temperature")
        self._attr_native_unit_of_measurement = engine.store.unit

    @property
    def available(self) -> bool:
        """Return whether the schedule is active."""
        room = self.engine.store.rooms.get(self.climate_entity_id)
        return bool(room and room.enabled)

    @property
    def native_value(self) -> float | None:
        """Return the scheduled temperature; unknown while heating is off."""
        return self.engine.room_status(self.climate_entity_id)["temperature"]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return details about the current and next block."""
        status = self.engine.room_status(self.climate_entity_id)
        return {
            ATTR_SEASON: status["season"],
            ATTR_PROGRAM: status["program"],
            ATTR_AWAY: status["away"],
            ATTR_BLOCK_NAME: status["name"],
            ATTR_BLOCK_START: status["start"],
            ATTR_BLOCK_END: status["end"],
            ATTR_NEXT_TEMPERATURE: status["next_temperature"],
            ATTR_NEXT_BLOCK_NAME: status["next_name"],
            ATTR_HEATING_OFF: status["temperature"] is None,
            ATTR_PENDING: status["pending"],
            ATTR_OVERRIDDEN: status["overridden"],
            ATTR_LAST_ERROR: status["last_error"],
        }
