import { describe, expect, it } from "vitest";

import { celsiusColor, temperatureColor } from "../src/colors";
import { firstWeekday, formatMinutes, uses12h, weekdayName, zonedTime } from "../src/format";
import { localizer, translations } from "../src/localize";
import { clamp, formatTemperature, limitsFor } from "../src/temperature";

describe("temperatures", () => {
  it("formats like Tado in Celsius", () => {
    expect(formatTemperature(19, "°C", 0.5, false, "en")).toBe("19.0°");
    expect(formatTemperature(19, "°C", 0.5, true, "en")).toBe("19°");
    expect(formatTemperature(19.5, "°C", 0.5, true, "nl")).toBe("19,5°");
  });

  it("uses whole degrees in Fahrenheit", () => {
    expect(formatTemperature(68, "°F", 1, false, "en-US")).toBe("68°");
  });

  it("reads limits from the entity with defaults per unit", () => {
    expect(limitsFor(undefined, "°F")).toEqual({ min: 41, max: 86, step: 1 });
    expect(limitsFor({ entity_id: "climate.a", state: "heat", attributes: { min_temp: 5, max_temp: 25, target_temp_step: 0.1 } }, "°C")).toEqual({ min: 5, max: 25, step: 0.1 });
  });

  it("clamps and rounds to the step", () => {
    expect(clamp(25.3, { min: 5, max: 25, step: 0.5 })).toBe(25);
    expect(clamp(19.26, { min: 5, max: 25, step: 0.5 })).toBe(19.5);
  });
});

describe("colours", () => {
  it("gives a temperature the same colour in both units", () => {
    expect(temperatureColor(68, "°F")).toBe(temperatureColor(20, "°C"));
    expect(temperatureColor(null, "°C")).toContain("--shs-color-off");
  });

  it("uses the legend's bands", () => {
    expect(celsiusColor(16)).toBe("#a9cbee");
    expect(celsiusColor(17.5)).toBe("#f5cf9a");
    expect(celsiusColor(20)).toBe("#ef9f5c");
    expect(celsiusColor(21)).toBe("#e5794a");
    expect(celsiusColor(null)).toBe("#d5d9df");
  });
});

describe("time", () => {
  it("formats 24 and 12 hour times", () => {
    expect(formatMinutes(420, false)).toBe("07:00");
    expect(formatMinutes(480, false, true)).toBe("8:00");
    expect(formatMinutes(1440, false, true)).toBe("24:00");
    expect(formatMinutes(1440, false)).toBe("00:00");
    expect(formatMinutes(0, true)).toBe("12:00 AM");
    expect(formatMinutes(13 * 60 + 30, true)).toBe("1:30 PM");
  });

  it("follows the user's time format", () => {
    expect(uses12h({ locale: { language: "en", time_format: "12" } })).toBe(true);
    expect(uses12h({ locale: { language: "en-US", time_format: "24" } })).toBe(false);
    expect(uses12h({ locale: { language: "nl", time_format: "language" } })).toBe(false);
  });

  it("finds the weekday and time in the server time zone", () => {
    // Monday 26 October 2026 23:30 UTC is Tuesday 00:30 in Amsterdam.
    expect(zonedTime(new Date(Date.UTC(2026, 9, 26, 23, 30)), "Europe/Amsterdam")).toEqual({
      weekday: 1,
      minutes: 30,
    });
  });

  it("names weekdays and the first day of the week", () => {
    expect(weekdayName("nl", 0)).toBe("Maandag");
    expect(firstWeekday({ locale: { language: "en", first_weekday: "sunday" } })).toBe(6);
  });
});

describe("localize", () => {
  it("translates with fallback to English", () => {
    expect(localizer("it")("away.label")).toBe("Fuori casa");
    expect(localizer("it-IT")("block.split")).toBe("Dividi");
    expect(localizer("ja")("block.split")).toBe("Split");
    expect(localizer("it")("programs.day_other", { day: "Lunedì", program: "Feriali" })).toBe(
      "Lunedì: in Feriali, tocca per spostarlo qui",
    );
    expect(localizer("en")("status.until", { temperature: "20°", time: "22:00" })).toBe("20° until 22:00");
  });

  const flatten = (value: unknown, prefix = ""): Record<string, string> =>
    typeof value === "string"
      ? { [prefix]: value }
      : Object.assign(
          {},
          ...Object.entries(value as object).map(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key)),
        );
  const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
  const english = flatten(translations.en);

  it.each(Object.keys(translations))("%s keeps every placeholder", (language) => {
    const strings = flatten(translations[language]);
    expect(Object.keys(strings).sort()).toEqual(Object.keys(english).sort());
    for (const [key, text] of Object.entries(strings)) {
      expect(placeholders(text), `${language} ${key}`).toEqual(placeholders(english[key]));
      expect(text.trim(), `${language} ${key}`).not.toBe("");
    }
  });
});
