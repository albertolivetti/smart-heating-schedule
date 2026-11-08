"""Fixtures for the seasonal heating schedule tests."""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import ClimateEntityFeature, HVACMode
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.smart_heating_schedule.const import (
    CONF_ADMIN_ONLY,
    CONF_AWAY_TEMPERATURE,
    DOMAIN,
)

CLIMATE = "climate.living_room"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Enable custom integrations in all tests."""


@pytest.fixture
def heat_state() -> dict[str, Any]:
    """Attributes of a typical radiator thermostat."""
    return {
        "hvac_modes": [HVACMode.OFF, HVACMode.HEAT, HVACMode.AUTO],
        "min_temp": 5,
        "max_temp": 25,
        "target_temp_step": 0.5,
        "temperature": 17,
        "supported_features": ClimateEntityFeature.TARGET_TEMPERATURE,
    }


@pytest.fixture
def boiler_state() -> dict[str, Any]:
    """Attributes of a generic_thermostat driving a boiler, with presets."""
    return {
        "hvac_modes": [HVACMode.HEAT, HVACMode.OFF],
        "min_temp": 7,
        "max_temp": 35,
        "target_temp_step": 0.1,
        "preset_modes": ["none", "away", "comfort", "sleep"],
        "preset_mode": "comfort",
        "temperature": 20,
        "current_temperature": 18.7,
        "supported_features": ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.PRESET_MODE
        | ClimateEntityFeature.TURN_OFF
        | ClimateEntityFeature.TURN_ON,
    }


@pytest.fixture
def config_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Return a config entry added to hass."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Cronotermostato",
        options={CONF_AWAY_TEMPERATURE: 15.0, CONF_ADMIN_ONLY: False},
    )
    entry.add_to_hass(hass)
    return entry


async def setup_integration(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Set up the integration (and http, which the panel needs)."""
    assert await async_setup_component(hass, "http", {})
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
