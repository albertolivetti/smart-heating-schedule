"""Config flow for the seasonal heating schedule."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
)
import voluptuous as vol

from .const import (
    CONF_ADMIN_ONLY,
    CONF_AWAY_TEMPERATURE,
    DEFAULT_AWAY_TEMPERATURE,
    DOMAIN,
    TITLE,
)

OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_AWAY_TEMPERATURE): NumberSelector(
            NumberSelectorConfig(min=5, max=86, step=0.5, mode=NumberSelectorMode.BOX)
        ),
        vol.Required(CONF_ADMIN_ONLY): BooleanSelector(),
    }
)


def default_options(unit: str) -> dict[str, Any]:
    """Return the options of a new entry."""
    return {
        CONF_AWAY_TEMPERATURE: DEFAULT_AWAY_TEMPERATURE.get(unit, DEFAULT_AWAY_TEMPERATURE["°C"]),
        CONF_ADMIN_ONLY: False,
    }


class SmartHeatingScheduleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up the integration; there is nothing to configure up front."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Confirm the setup."""
        if user_input is not None:
            return self.async_create_entry(
                title=TITLE,
                data={},
                options=default_options(self.hass.config.units.temperature_unit),
            )
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlowHandler:
        """Return the options flow."""
        return OptionsFlowHandler()


class OptionsFlowHandler(OptionsFlowWithReload):
    """Choose the away temperature and who can see the panel."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_SCHEMA,
                {
                    **default_options(self.hass.config.units.temperature_unit),
                    **self.config_entry.options,
                },
            ),
        )
