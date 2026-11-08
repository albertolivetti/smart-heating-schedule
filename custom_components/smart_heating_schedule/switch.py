"""Switches: a room's schedule on or off, and Away."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import SmartHeatingConfigEntry
from .const import SIGNAL_ROOM_ADDED
from .engine import ScheduleEngine
from .entity import GlobalEntity, RoomEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SmartHeatingConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the schedule switches."""
    engine = entry.runtime_data
    async_add_entities(
        [
            AwaySwitch(engine),
            *(ScheduleSwitch(engine, entity_id) for entity_id in engine.store.rooms),
        ]
    )

    @callback
    def _room_added(entity_id: str) -> None:
        async_add_entities([ScheduleSwitch(engine, entity_id)])

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_ROOM_ADDED, _room_added))


class ScheduleSwitch(RoomEntity, SwitchEntity):
    """Turns the smart schedule of a thermostat on or off."""

    def __init__(self, engine: ScheduleEngine, climate_entity_id: str) -> None:
        """Initialize the switch."""
        super().__init__(engine, climate_entity_id, "smart_schedule")

    @property
    def available(self) -> bool:
        """Return whether the room still exists."""
        return self.climate_entity_id in self.engine.store.rooms

    @property
    def is_on(self) -> bool:
        """Return whether the schedule is active."""
        room = self.engine.store.rooms.get(self.climate_entity_id)
        return bool(room and room.enabled)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the schedule on."""
        await self.engine.async_update_room(self.climate_entity_id, enabled=True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the schedule off."""
        await self.engine.async_update_room(self.climate_entity_id, enabled=False)


class AwaySwitch(GlobalEntity, SwitchEntity):
    """Away: thermostats use their away preset (or the away temperature) until turned off."""

    def __init__(self, engine: ScheduleEngine) -> None:
        """Initialize the switch."""
        super().__init__(engine, "away")

    @property
    def is_on(self) -> bool:
        """Return whether Away is on."""
        return self.engine.away

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn Away on."""
        await self.engine.async_set_away(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn Away off."""
        await self.engine.async_set_away(False)
