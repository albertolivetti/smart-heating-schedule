import { DOMAIN, type HomeAssistant, type PanelState, type Program, type Season } from "./types";

export const subscribeState = (
  hass: HomeAssistant,
  callback: (state: PanelState) => void,
): Promise<() => void> => hass.connection.subscribeMessage(callback, { type: `${DOMAIN}/subscribe` });

export const addRoom = (hass: HomeAssistant, entityId: string) =>
  hass.callWS({ type: `${DOMAIN}/room/add`, entity_id: entityId });

export const removeRoom = (hass: HomeAssistant, entityId: string) =>
  hass.callWS({ type: `${DOMAIN}/room/remove`, entity_id: entityId });

export const saveRoom = (
  hass: HomeAssistant,
  entityId: string,
  data: { enabled?: boolean; programs?: Record<string, Program[]> },
) => hass.callWS({ type: `${DOMAIN}/room/save`, entity_id: entityId, ...data });

/** Undo manual changes: set the thermostat back to the current block. */
export const resumeRoom = (hass: HomeAssistant, entityId: string) =>
  hass.callWS({ type: `${DOMAIN}/room/resume`, entity_id: entityId });

export const saveSeasons = (hass: HomeAssistant, seasons: Season[]) =>
  hass.callWS({ type: `${DOMAIN}/seasons/save`, seasons });

/** Back to Home Assistant's meteorological seasons. */
export const resetSeasons = (hass: HomeAssistant) => hass.callWS({ type: `${DOMAIN}/seasons/reset` });

export const setAway = (hass: HomeAssistant, away: boolean) =>
  hass.callWS({ type: `${DOMAIN}/away/set`, away });
