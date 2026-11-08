"""Tests for services, the websocket API, config flow, repairs and diagnostics."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from homeassistant import config_entries
from homeassistant.components.repairs import DOMAIN as REPAIRS_DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.smart_heating_schedule.const import (
    CONF_ADMIN_ONLY,
    CONF_AWAY_TEMPERATURE,
    DOMAIN,
)
from custom_components.smart_heating_schedule.diagnostics import (
    async_get_config_entry_diagnostics,
)

from .conftest import CLIMATE, setup_integration

TZ = ZoneInfo("Europe/Amsterdam")


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer, heat_state) -> None:
    """Fixed time (autumn) and two thermostats."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    freezer.move_to(datetime(2026, 10, 26, 12, 0, tzinfo=TZ))
    hass.states.async_set(CLIMATE, "heat", heat_state)
    hass.states.async_set("climate.bedroom", "heat", heat_state)


async def test_services(hass: HomeAssistant, config_entry: MockConfigEntry) -> None:
    calls = async_mock_service(hass, "climate", "set_temperature")
    await setup_integration(hass, config_entry)

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "get_schedule", {"entity_id": CLIMATE}, blocking=True, return_response=True
        )

    autumn = [
        {
            "id": "p1",
            "name": "Tutti i giorni",
            "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            "blocks": [
                {"start": "00:00", "temperature": 17},
                {"start": "06:00", "temperature": 21.5},
            ],
        }
    ]
    await hass.services.async_call(
        DOMAIN,
        "set_schedule",
        {"entity_id": CLIMATE, "programs": {"autumn": autumn}},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert calls[-1].data["temperature"] == 21.5

    response = await hass.services.async_call(
        DOMAIN, "get_schedule", {"entity_id": CLIMATE}, blocking=True, return_response=True
    )
    assert response["unit"] == "°C"
    assert response["programs"]["autumn"][0]["blocks"][1]["temperature"] == 21.5
    assert [season["id"] for season in response["seasons"]] == [
        "winter",
        "spring",
        "summer",
        "autumn",
    ]

    autumn[0]["blocks"][0]["start"] = "01:00"
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "set_schedule",
            {"entity_id": CLIMATE, "programs": {"autumn": autumn}},
            blocking=True,
        )
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "set_schedule",
            {"entity_id": CLIMATE, "programs": {"monsoon": []}},
            blocking=True,
        )

    await hass.services.async_call(DOMAIN, "resume_schedule", {"entity_id": CLIMATE}, blocking=True)
    assert len(calls) == 2


async def test_websocket(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_ws_client
) -> None:
    calls = async_mock_service(hass, "climate", "set_temperature")
    await setup_integration(hass, config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": f"{DOMAIN}/subscribe"})
    assert (await client.receive_json())["success"]
    event = (await client.receive_json())["event"]
    assert event["rooms"] == []
    assert event["unit"] == "°C"
    assert event["away"] is False
    assert event["away_temperature"] == 15.0
    assert event["season"] == "autumn"
    assert len(event["seasons"]) == 4

    await client.send_json_auto_id({"type": f"{DOMAIN}/room/add", "entity_id": CLIMATE})
    while "result" not in (msg := await client.receive_json()) and msg.get("type") != "result":
        pass
    assert msg["success"]
    await hass.async_block_till_done()
    assert calls[-1].data["temperature"] == 20

    winter = [
        {
            "id": "w1",
            "name": "Feriali",
            "days": ["mon", "tue"],
            "blocks": [{"start": "00:00", "temperature": 12}],
        }
    ]
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/room/save", "entity_id": CLIMATE, "programs": {"winter": winter}}
    )
    msg = await _result(client)
    assert msg["success"]
    assert msg["result"]["programs"]["winter"][0]["blocks"] == [
        {"start": "00:00", "temperature": 12.0}
    ]
    assert "autumn" in msg["result"]["programs"]  # other seasons are kept

    winter[0]["blocks"] = []
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/room/save", "entity_id": CLIMATE, "programs": {"winter": winter}}
    )
    msg = await _result(client)
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_format"

    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/room/copy", "entity_id": CLIMATE, "targets": ["climate.bedroom"]}
    )
    assert (await _result(client))["success"]
    engine = config_entry.runtime_data
    assert engine.store.rooms["climate.bedroom"].programs["winter"][0].blocks[0].temperature == 12

    await client.send_json_auto_id({"type": f"{DOMAIN}/away/set", "away": True})
    assert (await _result(client))["success"]
    assert engine.away
    await hass.async_block_till_done()
    assert calls[-1].data["temperature"] == 15.0

    seasons = [
        {"id": "heating", "name": "Riscaldamento", "start": "10-15", "end": "04-15"},
    ]
    await client.send_json_auto_id({"type": f"{DOMAIN}/seasons/save", "seasons": seasons})
    assert (await _result(client))["success"]
    assert [s.id for s in engine.store.seasons] == ["heating"]
    assert engine.store.rooms[CLIMATE].programs == {}

    seasons.append({"id": "other", "name": "Altro", "start": "04-15", "end": "05-01"})
    await client.send_json_auto_id({"type": f"{DOMAIN}/seasons/save", "seasons": seasons})
    msg = await _result(client)
    assert msg["error"]["code"] == "invalid_format"

    await client.send_json_auto_id({"type": f"{DOMAIN}/seasons/reset"})
    assert (await _result(client))["success"]
    assert len(engine.store.seasons) == 4

    await client.send_json_auto_id({"type": f"{DOMAIN}/room/remove", "entity_id": CLIMATE})
    assert (await _result(client))["success"]
    assert list(engine.store.rooms) == ["climate.bedroom"]


async def test_websocket_requires_admin(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_ws_client, hass_admin_user
) -> None:
    await setup_integration(hass, config_entry)
    hass_admin_user.groups = []
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/room/add", "entity_id": CLIMATE})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "unauthorized"


async def test_websocket_resume_allowed_for_users(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_ws_client, hass_admin_user
) -> None:
    calls = async_mock_service(hass, "climate", "set_temperature")
    await setup_integration(hass, config_entry)
    await config_entry.runtime_data.async_add_room(CLIMATE)
    hass_admin_user.groups = []
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/room/resume", "entity_id": CLIMATE})
    assert (await _result(client))["success"]
    assert len(calls) == 2


async def _result(client) -> dict:
    while (msg := await client.receive_json())["type"] != "result":
        pass
    return msg


async def test_config_and_options_flow(hass: HomeAssistant) -> None:
    assert await async_setup_component(hass, "http", {})
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    entry = result["result"]
    assert entry.options == {CONF_AWAY_TEMPERATURE: 15.0, CONF_ADMIN_ONLY: False}
    await hass.async_block_till_done()

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {CONF_AWAY_TEMPERATURE: 14.5, CONF_ADMIN_ONLY: True},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    engine = entry.runtime_data
    assert engine.away_temperature == 14.5
    assert hass.data["frontend_panels"]["smart-heating-schedule"].require_admin


async def test_repair_flow(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_client, heat_state
) -> None:
    async_mock_service(hass, "climate", "set_temperature")
    registry = er.async_get(hass)
    hass.states.async_remove(CLIMATE)
    registry.async_get_or_create("climate", "test", "abc", suggested_object_id="living_room")
    hass.states.async_set(CLIMATE, "heat", heat_state)
    await setup_integration(hass, config_entry)
    assert await async_setup_component(hass, REPAIRS_DOMAIN, {})
    engine = config_entry.runtime_data
    await engine.async_add_room(CLIMATE)
    registry.async_remove(CLIMATE)
    await hass.async_block_till_done()

    client = await hass_client()
    resp = await client.post(
        "/api/repairs/issues/fix",
        json={"handler": DOMAIN, "issue_id": f"entity_missing_{CLIMATE}"},
    )
    flow = await resp.json()
    assert flow["type"] == "menu"
    resp = await client.post(
        f"/api/repairs/issues/fix/{flow['flow_id']}", json={"next_step_id": "reassign"}
    )
    flow = await resp.json()
    resp = await client.post(
        f"/api/repairs/issues/fix/{flow['flow_id']}", json={"entity_id": "climate.bedroom"}
    )
    assert (await resp.json())["type"] == "create_entry"
    await hass.async_block_till_done()
    assert list(engine.store.rooms) == ["climate.bedroom"]


async def test_diagnostics(hass: HomeAssistant, config_entry: MockConfigEntry) -> None:
    async_mock_service(hass, "climate", "set_temperature")
    await setup_integration(hass, config_entry)
    await config_entry.runtime_data.async_add_room(CLIMATE)
    diagnostics = await async_get_config_entry_diagnostics(hass, config_entry)
    assert diagnostics["state"]["rooms"][0]["entity_id"] == CLIMATE
    assert CLIMATE in diagnostics["last_applied"]
