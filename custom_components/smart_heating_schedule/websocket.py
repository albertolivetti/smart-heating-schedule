"""Websocket API used by the panel."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.components.climate import DOMAIN as CLIMATE_DOMAIN
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
import voluptuous as vol

from .const import DOMAIN, SIGNAL_UPDATED
from .engine import ScheduleEngine
from .models import programs_by_season, seasons_from_list

ENTITY_ID = vol.All(cv.entity_id, cv.entity_domain(CLIMATE_DOMAIN))


@callback
def async_setup_websocket(hass: HomeAssistant) -> None:
    """Register the websocket commands."""
    for command in (
        ws_subscribe,
        ws_add_room,
        ws_remove_room,
        ws_save_room,
        ws_copy_room,
        ws_resume_room,
        ws_save_seasons,
        ws_reset_seasons,
        ws_set_away,
    ):
        websocket_api.async_register_command(hass, command)


def _engine(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg_id: int
) -> ScheduleEngine | None:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        connection.send_error(msg_id, "not_loaded", "The heating schedule is not loaded")
        return None
    return entries[0].runtime_data


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the full state now and every time it changes."""
    if (engine := _engine(hass, connection, msg["id"])) is None:
        return

    @callback
    def _send() -> None:
        # Look the engine up again: the entry may have been reloaded.
        entries = hass.config_entries.async_loaded_entries(DOMAIN)
        if entries:
            connection.send_message(
                websocket_api.event_message(msg["id"], entries[0].runtime_data.as_dict())
            )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATED, _send)
    connection.send_result(msg["id"])
    connection.send_message(websocket_api.event_message(msg["id"], engine.as_dict()))


async def _run(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    action: Any,
) -> None:
    if (engine := _engine(hass, connection, msg["id"])) is None:
        return
    try:
        result = await action(engine)
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "home_assistant_error", str(err))
    else:
        connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/room/add", vol.Required("entity_id"): ENTITY_ID}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_add_room(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Start scheduling a climate entity."""

    async def action(engine: ScheduleEngine) -> dict[str, Any]:
        return (await engine.async_add_room(msg["entity_id"])).as_dict()

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/room/remove", vol.Required("entity_id"): ENTITY_ID}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_remove_room(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Stop scheduling a climate entity."""

    async def action(engine: ScheduleEngine) -> None:
        await engine.async_remove_room(msg["entity_id"])

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/save",
        vol.Required("entity_id"): ENTITY_ID,
        vol.Optional("enabled"): bool,
        vol.Optional("programs"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_room(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save the enabled flag and/or the programs of some seasons."""

    async def action(engine: ScheduleEngine) -> dict[str, Any]:
        programs = programs_by_season(msg["programs"]) if "programs" in msg else None
        room = await engine.async_update_room(
            msg["entity_id"], enabled=msg.get("enabled"), programs=programs
        )
        return room.as_dict()

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/room/copy",
        vol.Required("entity_id"): ENTITY_ID,
        vol.Required("targets"): [ENTITY_ID],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_copy_room(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Copy a room's schedule to other rooms."""

    async def action(engine: ScheduleEngine) -> None:
        await engine.async_copy_room(msg["entity_id"], msg["targets"])

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/room/resume", vol.Required("entity_id"): ENTITY_ID}
)
@websocket_api.async_response
async def ws_resume_room(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Undo manual changes: set the thermostat back to the current block."""

    async def action(engine: ScheduleEngine) -> None:
        await engine.async_resume(msg["entity_id"])

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/seasons/save", vol.Required("seasons"): list}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_seasons(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Replace the seasons."""

    async def action(engine: ScheduleEngine) -> None:
        await engine.async_set_seasons(seasons_from_list(msg["seasons"]))

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/seasons/reset"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_reset_seasons(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Go back to the meteorological seasons of Home Assistant."""

    async def action(engine: ScheduleEngine) -> None:
        await engine.async_reset_seasons()

    await _run(hass, connection, msg, action)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/away/set", vol.Required("away"): bool}
)
@websocket_api.async_response
async def ws_set_away(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Turn Away on or off, like the switch entity does."""

    async def action(engine: ScheduleEngine) -> None:
        await engine.async_set_away(msg["away"])

    await _run(hass, connection, msg, action)
