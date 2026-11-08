"""Diagnostics for the seasonal heating schedule."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from . import SmartHeatingConfigEntry


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: SmartHeatingConfigEntry
) -> dict[str, Any]:
    """Return schedules, live status and options."""
    engine = entry.runtime_data
    return {
        "options": dict(entry.options),
        "state": engine.as_dict(),
        "last_applied": engine.store.last_applied,
    }
