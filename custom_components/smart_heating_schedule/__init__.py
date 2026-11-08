"""Seasonal heating schedules (cronotermostato) for any thermostat."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .engine import ScheduleEngine
from .panel import async_register_panel, async_unregister_panel
from .services import async_setup_services
from .store import ScheduleStore
from .websocket import async_setup_websocket

PLATFORMS = [Platform.SENSOR, Platform.SWITCH]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type SmartHeatingConfigEntry = ConfigEntry[ScheduleEngine]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the services and websocket API."""
    async_setup_services(hass)
    async_setup_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: SmartHeatingConfigEntry) -> bool:
    """Set up the integration from a config entry."""
    store = ScheduleStore(hass)
    await store.async_load()
    engine = ScheduleEngine(hass, entry, store)
    entry.runtime_data = engine

    await engine.async_start()
    entry.async_on_unload(engine.async_stop)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_panel(hass, entry)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SmartHeatingConfigEntry) -> bool:
    """Unload a config entry."""
    async_unregister_panel(hass)
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.store.async_flush()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: SmartHeatingConfigEntry) -> None:
    """Delete the stored schedules when the integration is removed."""
    await ScheduleStore(hass).async_remove()
