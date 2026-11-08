"""Constants for the seasonal heating schedule."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "smart_heating_schedule"
TITLE: Final = "Cronotermostato"

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 2
RUNTIME_STORAGE_KEY: Final = f"{DOMAIN}.runtime"
RUNTIME_STORAGE_VERSION: Final = 1
SAVE_DELAY: Final = 1

PANEL_URL_PATH: Final = "cronotermostato"
PANEL_COMPONENT: Final = "smart-heating-schedule-panel"
PANEL_ICON: Final = "mdi:radiator"
PANEL_FILENAME: Final = "smart-heating-schedule-panel.js"
STATIC_URL: Final = "/smart_heating_schedule_static"

CONF_ADMIN_ONLY: Final = "admin_only"
CONF_AWAY_TEMPERATURE: Final = "away_temperature"
# Used when the thermostat has no "away" preset; °C and °F.
DEFAULT_AWAY_TEMPERATURE: Final = {"°C": 15.0, "°F": 59.0}
AWAY_PRESET: Final = "away"

WEEKDAYS: Final = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

SLOT_MINUTES: Final = 15
MINUTES_PER_DAY: Final = 24 * 60

# Fired when a block starts, so automations can follow the schedule.
EVENT_BLOCK_STARTED: Final = f"{DOMAIN}_block_started"

SIGNAL_UPDATED: Final = f"{DOMAIN}_updated"
SIGNAL_ROOM_ADDED: Final = f"{DOMAIN}_room_added"
SIGNAL_ROOM_REMOVED: Final = f"{DOMAIN}_room_removed_{{}}"

ATTR_SEASON: Final = "season"
ATTR_PROGRAM: Final = "program"
ATTR_AWAY: Final = "away"
ATTR_BLOCK_NAME: Final = "block_name"
ATTR_NEXT_BLOCK_NAME: Final = "next_block_name"
ATTR_BLOCK_START: Final = "block_start"
ATTR_BLOCK_END: Final = "block_end"
ATTR_NEXT_TEMPERATURE: Final = "next_temperature"
ATTR_HEATING_OFF: Final = "heating_off"
ATTR_PENDING: Final = "pending"
ATTR_OVERRIDDEN: Final = "overridden"
ATTR_LAST_ERROR: Final = "last_error"

SERVICE_RESUME_SCHEDULE: Final = "resume_schedule"
SERVICE_GET_SCHEDULE: Final = "get_schedule"
SERVICE_SET_SCHEDULE: Final = "set_schedule"
