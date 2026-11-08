"""Actions (services) for automations and scripts."""

from __future__ import annotations

from homeassistant.components.climate import DOMAIN as CLIMATE_DOMAIN
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import async_extract_entity_ids
import voluptuous as vol

from .const import (
    DOMAIN,
    SERVICE_GET_SCHEDULE,
    SERVICE_RESUME_SCHEDULE,
    SERVICE_SET_SCHEDULE,
)
from .engine import ScheduleEngine
from .models import RoomSchedule, programs_by_season

GET_SCHEDULE_SCHEMA = vol.Schema({vol.Required(ATTR_ENTITY_ID): cv.entity_domain(CLIMATE_DOMAIN)})
SET_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_domain(CLIMATE_DOMAIN),
        vol.Optional("enabled"): cv.boolean,
        vol.Optional("programs"): dict,
    }
)


def get_engine(hass: HomeAssistant) -> ScheduleEngine:
    """Return the engine of the loaded config entry."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0].runtime_data


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the integration's actions."""

    async def resume_schedule(call: ServiceCall) -> None:
        engine = get_engine(hass)
        for entity_id in await async_extract_entity_ids(call):
            await engine.async_resume(entity_id)

    async def get_schedule(call: ServiceCall) -> ServiceResponse:
        engine = get_engine(hass)
        entity_id = call.data[ATTR_ENTITY_ID]
        if (room := engine.store.rooms.get(entity_id)) is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="room_not_found",
                translation_placeholders={"entity_id": entity_id},
            )
        return {
            **room.as_dict(),
            "unit": engine.store.unit,
            "seasons": [season.as_dict() for season in engine.store.seasons],
        }

    async def set_schedule(call: ServiceCall) -> None:
        engine = get_engine(hass)
        entity_id = call.data[ATTR_ENTITY_ID]
        try:
            programs = (
                programs_by_season(call.data["programs"]) if "programs" in call.data else None
            )
            if entity_id not in engine.store.rooms:
                await engine.async_set_room(
                    RoomSchedule(
                        entity_id=entity_id,
                        enabled=call.data.get("enabled", True),
                        programs=programs or {},
                    )
                )
                return
            await engine.async_update_room(
                entity_id, enabled=call.data.get("enabled"), programs=programs
            )
        except vol.Invalid as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="invalid_schedule",
                translation_placeholders={"error": str(err)},
            ) from err

    hass.services.async_register(DOMAIN, SERVICE_RESUME_SCHEDULE, resume_schedule)
    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCHEDULE,
        get_schedule,
        schema=GET_SCHEDULE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_SCHEDULE, set_schedule, schema=SET_SCHEDULE_SCHEMA
    )
