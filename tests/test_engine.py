"""Tests for the scheduler engine running inside Home Assistant."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from freezegun.api import FrozenDateTimeFactory
from homeassistant.components.climate import HVACMode
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er, issue_registry as ir
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.smart_heating_schedule.const import DOMAIN
from custom_components.smart_heating_schedule.models import (
    Season,
    programs_by_season,
)

from .conftest import CLIMATE, setup_integration

TZ = ZoneInfo("Europe/Amsterdam")
SENSOR = "sensor.living_room_scheduled_temperature"
SWITCH = "switch.living_room_schedule"
AWAY = "switch.cronotermostato_away"


@pytest.fixture(autouse=True)
async def amsterdam(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """Run at Monday 26 October 2026 12:00 (autumn) in Amsterdam."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    freezer.move_to(datetime(2026, 10, 26, 12, 0, tzinfo=TZ))


@pytest.fixture
def calls(hass: HomeAssistant) -> tuple[list, list, list]:
    """Mock the climate services."""
    return (
        async_mock_service(hass, "climate", "set_temperature"),
        async_mock_service(hass, "climate", "set_hvac_mode"),
        async_mock_service(hass, "climate", "set_preset_mode"),
    )


def climate(hass: HomeAssistant, attrs: dict[str, Any], state: str = HVACMode.HEAT) -> None:
    hass.states.async_set(CLIMATE, state, attrs)


async def add_room(hass: HomeAssistant) -> None:
    engine = hass.config_entries.async_entries(DOMAIN)[0].runtime_data
    await engine.async_add_room(CLIMATE)
    await hass.async_block_till_done()


async def move_to(hass: HomeAssistant, freezer: FrozenDateTimeFactory, when: datetime) -> None:
    freezer.move_to(when)
    async_fire_time_changed(hass, when)
    await hass.async_block_till_done()


def program(name: str, days: list[str], *blocks: tuple[str, float | None]) -> dict[str, Any]:
    return {
        "id": name.lower().replace(" ", "_"),
        "name": name,
        "days": days,
        "blocks": [{"start": start, "temperature": temp} for start, temp in blocks],
    }


async def test_add_room_applies_and_creates_entities(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)

    set_temperature, _, _ = calls
    # Autumn, default program: 00:00 17°, 06:30 20°, 22:30 17°.
    assert set_temperature[-1].data == {"entity_id": CLIMATE, "temperature": 20.0}

    sensor = hass.states.get(SENSOR)
    assert hass.states.get(SWITCH).state == "on"
    assert float(sensor.state) == 20.0
    assert sensor.attributes["unit_of_measurement"] == "°C"
    assert sensor.attributes["next_temperature"] == 17.0
    assert sensor.attributes["season"] == "autumn"
    assert sensor.attributes["away"] is False
    assert hass.states.get(AWAY).state == "off"
    season = hass.states.get("sensor.cronotermostato_active_season")
    assert season.state == "Autumn"
    assert season.attributes["start"] == "09-01"


async def test_default_room_has_no_summer_program(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    room = config_entry.runtime_data.store.rooms[CLIMATE]
    assert set(room.programs) == {"winter", "spring", "autumn"}


async def test_transition_and_manual_change(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, _ = calls
    assert len(set_temperature) == 1

    # Someone turns the thermostat up by hand: kept until the next block.
    climate(hass, {**heat_state, "temperature": 23})
    await move_to(hass, freezer, datetime(2026, 10, 26, 22, 29, tzinfo=TZ))
    assert len(set_temperature) == 1

    await move_to(hass, freezer, datetime(2026, 10, 26, 22, 30, 1, tzinfo=TZ))
    assert set_temperature[-1].data["temperature"] == 17.0
    # 22:30 17° continues to 06:30 17° tomorrow: nothing is sent at midnight.
    await move_to(hass, freezer, datetime(2026, 10, 27, 0, 0, 1, tzinfo=TZ))
    assert len(set_temperature) == 2
    await move_to(hass, freezer, datetime(2026, 10, 27, 6, 30, 1, tzinfo=TZ))
    assert set_temperature[-1].data["temperature"] == 20.0


async def test_manual_change_is_overridden_until_resumed(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    freezer.tick()
    await add_room(hass)
    engine = config_entry.runtime_data
    set_temperature, _, _ = calls

    # The thermostat has not reported the new setpoint yet: not a manual change.
    assert not engine.room_status(CLIMATE)["overridden"]
    freezer.tick()
    climate(hass, {**heat_state, "temperature": 20})
    assert not engine.room_status(CLIMATE)["overridden"]

    climate(hass, {**heat_state, "temperature": 23})
    await hass.async_block_till_done()
    assert engine.room_status(CLIMATE)["overridden"]
    assert hass.states.get(SENSOR).attributes["overridden"]

    freezer.tick()
    await engine.async_resume(CLIMATE)
    await hass.async_block_till_done()
    assert set_temperature[-1].data["temperature"] == 20.0
    assert not engine.room_status(CLIMATE)["overridden"]

    # A manual change ends at the next block.
    freezer.tick()
    climate(hass, {**heat_state, "temperature": 20})
    climate(hass, {**heat_state, "temperature": 22})
    await hass.async_block_till_done()
    assert engine.room_status(CLIMATE)["overridden"]
    await move_to(hass, freezer, datetime(2026, 10, 26, 22, 30, 1, tzinfo=TZ))
    assert not engine.room_status(CLIMATE)["overridden"]


async def test_restart_keeps_manual_change(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, _ = calls
    climate(hass, {**heat_state, "temperature": 23})

    assert await hass.config_entries.async_reload(config_entry.entry_id)
    await hass.async_block_till_done()
    assert len(set_temperature) == 1


async def test_boiler_thermostat_with_presets(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, boiler_state
) -> None:
    # Like climate.riscaldamento: off, with the comfort preset active.
    climate(hass, boiler_state, HVACMode.OFF)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, set_preset = calls

    # The preset is cleared first, then heating at the scheduled temperature.
    assert set_preset[-1].data == {"entity_id": CLIMATE, "preset_mode": "none"}
    assert set_temperature[-1].data == {
        "entity_id": CLIMATE,
        "temperature": 20.0,
        "hvac_mode": HVACMode.HEAT,
    }
    climate(hass, {**boiler_state, "preset_mode": "none"})

    # Away uses the thermostat's own away preset.
    await hass.services.async_call("switch", "turn_on", {"entity_id": AWAY}, blocking=True)
    await hass.async_block_till_done()
    assert set_preset[-1].data == {"entity_id": CLIMATE, "preset_mode": "away"}
    assert hass.states.get(AWAY).state == "on"
    climate(hass, {**boiler_state, "preset_mode": "away"})
    # While away, block changes send nothing.
    count = len(set_temperature)
    await move_to(hass, freezer, datetime(2026, 10, 26, 22, 30, 1, tzinfo=TZ))
    assert len(set_temperature) == count

    await hass.services.async_call("switch", "turn_off", {"entity_id": AWAY}, blocking=True)
    await hass.async_block_till_done()
    assert set_preset[-1].data["preset_mode"] == "none"
    assert set_temperature[-1].data["temperature"] == 17.0


async def test_away_without_preset_uses_away_temperature(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, _ = calls

    await config_entry.runtime_data.async_set_away(True)
    await hass.async_block_till_done()
    assert set_temperature[-1].data["temperature"] == 15.0
    assert hass.states.get(SENSOR).attributes["away"] is True

    await config_entry.runtime_data.async_set_away(False)
    await hass.async_block_till_done()
    assert set_temperature[-1].data["temperature"] == 20.0


async def test_season_change_turns_heating_off_and_on(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, heat_state
) -> None:
    freezer.move_to(datetime(2026, 8, 30, 12, 0, tzinfo=TZ))
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, set_hvac_mode, _ = calls

    # Summer has no program: off.
    assert set_hvac_mode[-1].data == {"entity_id": CLIMATE, "hvac_mode": HVACMode.OFF}
    assert hass.states.get(SENSOR).attributes["heating_off"] is True
    climate(hass, heat_state, HVACMode.OFF)

    # 1 September, autumn starts at 17°.
    await move_to(hass, freezer, datetime(2026, 9, 1, 0, 0, 1, tzinfo=TZ))
    assert set_temperature[-1].data == {
        "entity_id": CLIMATE,
        "temperature": 17.0,
        "hvac_mode": HVACMode.HEAT,
    }


async def test_long_off_period_checks_again_daily(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, heat_state
) -> None:
    freezer.move_to(datetime(2026, 7, 1, 12, 0, tzinfo=TZ))
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    _, set_hvac_mode, _ = calls
    assert len(set_hvac_mode) == 1
    climate(hass, heat_state, HVACMode.OFF)

    when = datetime(2026, 7, 1, 12, 0, tzinfo=TZ)
    for day in range(1, 63):  # up to 1 September
        await move_to(hass, freezer, when + timedelta(days=day))
    # Off all summer with nothing more sent; autumn started on 1 September.
    assert len(set_hvac_mode) == 1
    # Jumping a day at a time lands at 12:00 on 1 September: the 20° block.
    set_temperature = calls[0]
    assert [call.data["temperature"] for call in set_temperature] == [20.0]


async def test_programs_per_weekday(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    engine = config_entry.runtime_data
    set_temperature, set_hvac_mode, _ = calls

    programs = programs_by_season(
        {
            "autumn": [
                program(
                    "Weekdays", ["mon", "tue", "wed", "thu", "fri"], ("00:00", 16), ("12:00", 19)
                ),
                # Saturday has no program: off.
                program("Sunday", ["sun"], ("00:00", 21)),
            ]
        }
    )
    await engine.async_update_room(CLIMATE, programs=programs)
    await hass.async_block_till_done()
    assert set_temperature[-1].data["temperature"] == 19.0
    assert hass.states.get(SENSOR).attributes["program"] == "weekdays"

    await move_to(hass, freezer, datetime(2026, 10, 31, 0, 0, 1, tzinfo=TZ))
    assert set_hvac_mode[-1].data["hvac_mode"] == HVACMode.OFF
    climate(hass, heat_state, HVACMode.OFF)
    await move_to(hass, freezer, datetime(2026, 11, 1, 0, 0, 1, tzinfo=TZ))
    assert set_temperature[-1].data["temperature"] == 21.0


async def test_edit_seasons(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    engine = config_entry.runtime_data
    _, set_hvac_mode, _ = calls

    # Heating only from 15 November: today (26 October) is outside every season.
    await engine.async_set_seasons([Season("heating", "Heating", (11, 15), (4, 15), "#2f6fca")])
    await hass.async_block_till_done()
    assert set_hvac_mode[-1].data["hvac_mode"] == HVACMode.OFF
    assert engine.store.rooms[CLIMATE].programs == {}
    assert hass.states.get("sensor.cronotermostato_active_season").state == "unknown"

    await engine.async_reset_seasons()
    assert [season.id for season in engine.store.seasons] == [
        "winter",
        "spring",
        "summer",
        "autumn",
    ]


async def test_unknown_season_is_rejected(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    import voluptuous as vol

    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    with pytest.raises(vol.Invalid):
        await config_entry.runtime_data.async_update_room(
            CLIMATE, programs=programs_by_season({"nope": []})
        )


async def test_unavailable_then_back(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, {}, STATE_UNAVAILABLE)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, _ = calls
    assert not set_temperature
    assert hass.states.get(SENSOR).attributes["pending"] is True

    climate(hass, heat_state)
    await hass.async_block_till_done()
    assert set_temperature[-1].data["temperature"] == 20.0
    assert hass.states.get(SENSOR).attributes["pending"] is False


async def test_edit_and_switch(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    engine = config_entry.runtime_data
    set_temperature, _, _ = calls
    autumn = [p.as_dict() for p in engine.store.rooms[CLIMATE].programs["autumn"]]

    # Moving the current block's start keeps the same temperature: no command.
    autumn[0]["blocks"][1]["start"] = "06:00"
    await engine.async_update_room(CLIMATE, programs=programs_by_season({"autumn": autumn}))
    assert len(set_temperature) == 1

    autumn[0]["blocks"][1]["temperature"] = 21
    await engine.async_update_room(CLIMATE, programs=programs_by_season({"autumn": autumn}))
    assert set_temperature[-1].data["temperature"] == 21

    await hass.services.async_call("switch", "turn_off", {"entity_id": SWITCH}, blocking=True)
    assert hass.states.get(SENSOR).state == "unavailable"
    await hass.services.async_call("switch", "turn_on", {"entity_id": SWITCH}, blocking=True)
    await hass.async_block_till_done()
    # Turning the schedule on applies the block again, even if unchanged.
    assert len(set_temperature) == 3


async def test_remove_room_removes_entities(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    await config_entry.runtime_data.async_remove_room(CLIMATE)
    await hass.async_block_till_done()
    assert hass.states.get(SWITCH) is None
    assert er.async_get(hass).async_get(SWITCH) is None


async def test_fahrenheit(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    hass.config.units = US_CUSTOMARY_SYSTEM
    climate(hass, {**heat_state, "min_temp": 41, "max_temp": 86, "target_temp_step": 1})
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, _ = calls
    assert set_temperature[-1].data["temperature"] == 68.0
    sensor = hass.states.get(SENSOR)
    assert sensor.attributes["unit_of_measurement"] == "°F"
    assert float(sensor.state) == 68.0


async def test_migrates_home_away_schedules(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_storage: dict, calls, heat_state
) -> None:
    weekday = [{"start": "00:00", "temperature": 18}, {"start": "07:00", "temperature": 20}]
    weekend = [{"start": "00:00", "temperature": 19}]
    days = {day: weekday for day in ("mon", "tue", "wed", "thu", "fri")}
    days |= {"sat": weekend, "sun": weekend}
    hass_storage[DOMAIN] = {
        "version": 1,
        "minor_version": 1,
        "key": DOMAIN,
        "data": {
            "unit": "°C",
            "rooms": {
                CLIMATE: {
                    "entity_id": CLIMATE,
                    "enabled": True,
                    "home": {"days": days},
                    "away": {"days": days},
                }
            },
        },
    }
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    engine = config_entry.runtime_data
    autumn = engine.store.rooms[CLIMATE].programs["autumn"]
    assert [p.days for p in autumn] == [["mon", "tue", "wed", "thu", "fri"], ["sat", "sun"]]
    assert "summer" not in engine.store.rooms[CLIMATE].programs
    assert calls[0][-1].data["temperature"] == 20


async def test_unit_change_converts_stored_schedules(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_storage: dict, calls, heat_state
) -> None:
    from custom_components.smart_heating_schedule.models import default_room, default_seasons

    seasons = default_seasons("en")
    hass_storage[DOMAIN] = {
        "version": 2,
        "minor_version": 1,
        "key": DOMAIN,
        "data": {
            "unit": "°C",
            "seasons": [season.as_dict() for season in seasons],
            "rooms": {CLIMATE: default_room(CLIMATE, "°C", seasons, "en").as_dict()},
        },
    }
    hass.config.units = US_CUSTOMARY_SYSTEM
    climate(hass, {**heat_state, "min_temp": 41, "max_temp": 86})
    await setup_integration(hass, config_entry)
    room = config_entry.runtime_data.store.rooms[CLIMATE]
    assert [b.temperature for b in room.programs["autumn"][0].blocks] == [63, 68, 63]
    assert calls[0][-1].data["temperature"] == 68


async def test_rename_and_remove_climate_entity(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    registry = er.async_get(hass)
    registry.async_get_or_create("climate", "test", "abc", suggested_object_id="living_room")
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)

    registry.async_update_entity(CLIMATE, new_entity_id="climate.lounge")
    await hass.async_block_till_done()
    engine = config_entry.runtime_data
    assert list(engine.store.rooms) == ["climate.lounge"]

    registry.async_remove("climate.lounge")
    await hass.async_block_till_done()
    issue = ir.async_get(hass).async_get_issue(DOMAIN, "entity_missing_climate.lounge")
    assert issue is not None


async def test_unloaded_panel(
    hass: HomeAssistant, config_entry: MockConfigEntry, heat_state
) -> None:
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    assert "cronotermostato" in hass.data["frontend_panels"]
    assert await hass.config_entries.async_unload(config_entry.entry_id)
    assert "cronotermostato" not in hass.data["frontend_panels"]


async def test_entities_on_thermostat_device(
    hass: HomeAssistant, config_entry: MockConfigEntry, calls, heat_state
) -> None:
    from homeassistant.helpers import device_registry as dr

    other = MockConfigEntry(domain="tado")
    other.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=other.entry_id, identifiers={("tado", "zone-4")}, name="Slaapkamer"
    )
    er.async_get(hass).async_get_or_create(
        "climate", "tado", "zone-4", suggested_object_id="living_room", device_id=device.id
    )
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)

    entry = er.async_get(hass).async_get("switch.slaapkamer_schedule")
    assert entry is not None
    assert entry.device_id == device.id


async def test_long_off_stretch_keeps_manual_change(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, heat_state
) -> None:
    freezer.move_to(datetime(2026, 6, 2, 12, 0, tzinfo=TZ))
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    _, set_hvac_mode, _ = calls
    assert len(set_hvac_mode) == 1
    # Someone turns the heating on by hand in summer: never undone by the schedule.
    climate(hass, heat_state, HVACMode.HEAT)
    for day in range(3, 30):
        await move_to(hass, freezer, datetime(2026, 6, day, 12, 0, tzinfo=TZ))
    assert len(set_hvac_mode) == 1


async def test_away_keeps_heating_off_outside_seasons(
    hass: HomeAssistant, config_entry: MockConfigEntry, freezer, calls, boiler_state
) -> None:
    freezer.move_to(datetime(2026, 8, 30, 12, 0, tzinfo=TZ))
    climate(hass, {**boiler_state, "preset_mode": "none"}, HVACMode.OFF)
    await setup_integration(hass, config_entry)
    await add_room(hass)
    set_temperature, _, set_preset = calls

    await config_entry.runtime_data.async_set_away(True)
    await hass.async_block_till_done()
    assert not set_preset
    assert not set_temperature
    # Autumn starts during Away: the away preset is used from then on.
    await move_to(hass, freezer, datetime(2026, 9, 1, 0, 0, 1, tzinfo=TZ))
    assert set_preset[-1].data["preset_mode"] == "away"


async def test_migrates_forced_away(
    hass: HomeAssistant, config_entry: MockConfigEntry, hass_storage: dict, calls, heat_state
) -> None:
    hass_storage[f"{DOMAIN}.runtime"] = {
        "version": 1,
        "minor_version": 1,
        "key": f"{DOMAIN}.runtime",
        "data": {"presence_mode": "away", "last_applied": {}},
    }
    climate(hass, heat_state)
    await setup_integration(hass, config_entry)
    assert config_entry.runtime_data.away
