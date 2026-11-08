/**
 * Block colours in four temperature bands, like the panel's legend: light
 * blue up to 16 °C, light orange 17-18 °C, orange 19-20 °C and deep orange
 * from 21 °C; grey for off. Bands are in °C so a temperature has the same
 * colour in Fahrenheit. Themes can override them with --shs-color-cold,
 * --shs-color-cool, --shs-color-warm, --shs-color-hot and --shs-color-off.
 */
import { toCelsius } from "./temperature";

export interface Band {
  name: "cold" | "cool" | "warm" | "hot";
  /** Highest °C in the band (inclusive). */
  upTo: number;
  color: string;
}

export const BANDS: Band[] = [
  { name: "cold", upTo: 16, color: "#a9cbee" },
  { name: "cool", upTo: 18, color: "#f5cf9a" },
  { name: "warm", upTo: 20, color: "#ef9f5c" },
  { name: "hot", upTo: Infinity, color: "#e5794a" },
];

export const OFF_COLOR = "#d5d9df";

/** The band of a temperature in °C. */
export const bandFor = (celsius: number): Band => BANDS.find((band) => celsius <= band.upTo)!;

/** The colour of a temperature in °C (null = heating off). */
export const celsiusColor = (celsius: number | null): string =>
  celsius === null ? OFF_COLOR : bandFor(celsius).color;

/** CSS colour for a block, overridable by themes. */
export const temperatureColor = (temperature: number | null, unit: string): string => {
  if (temperature === null) return `var(--shs-color-off, ${OFF_COLOR})`;
  const band = bandFor(toCelsius(temperature, unit));
  return `var(--shs-color-${band.name}, ${band.color})`;
};

/** Text on a block: dark on every band, readable in light and dark themes. */
export const BLOCK_TEXT = "#1f2a37";
