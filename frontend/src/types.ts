export const DOMAIN = "smart_heating_schedule";

/** A block starts at `start` ("HH:MM") and lasts until the next block (or 24:00). */
export interface Block {
  start: string;
  /** Target temperature, or null for heating off. */
  temperature: number | null;
}

/** The day schedule of one or more weekdays ("mon" … "sun") within a season. */
export interface Program {
  id: string;
  name: string;
  days: string[];
  blocks: Block[];
}

/** A date range that repeats every year; `start` and `end` are "MM-DD". */
export interface Season {
  id: string;
  name: string;
  start: string;
  end: string;
  color: string | null;
}

export interface RoomStatus {
  season: string | null;
  program: string | null;
  away: boolean;
  temperature: number | null;
  start: string | null;
  end: string | null;
  next_temperature: number | null;
  pending: boolean;
  /** The thermostat was changed by hand and no longer follows the current block. */
  overridden: boolean;
  last_error: string | null;
}

export interface Room {
  entity_id: string;
  enabled: boolean;
  /** Programs keyed by season id. */
  programs: Record<string, Program[]>;
  status: RoomStatus;
}

export interface PanelState {
  unit: string;
  away: boolean;
  away_temperature: number;
  /** Id of today's season, or null outside every season. */
  season: string | null;
  seasons: Season[];
  rooms: Room[];
}

// The parts of Home Assistant's frontend objects that the panel uses.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  name?: string | null;
  device_id?: string;
  area_id?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryDisplayEntry>;
  devices: Record<string, { name?: string | null; name_by_user?: string | null; area_id?: string | null }>;
  areas: Record<string, { name: string }>;
  user?: { is_admin: boolean };
  language: string;
  locale: {
    language: string;
    time_format?: "language" | "system" | "12" | "24";
    first_weekday?: string;
  };
  themes: { darkMode?: boolean };
  config: { unit_system: { temperature: string }; time_zone: string };
  dockedSidebar?: string;
  connection: {
    subscribeMessage<T>(callback: (message: T) => void, message: Record<string, unknown>): Promise<() => void>;
  };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}

export interface Route {
  prefix: string;
  path: string;
}
