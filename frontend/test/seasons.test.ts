import { describe, expect, it } from "vitest";

import {
  dayOfYear,
  freeDays,
  fromDayOfYear,
  overlappingSeason,
  seasonContains,
  seasonRanges,
  uncoveredRanges,
  wrapsNewYear,
} from "../src/seasons";
import type { Season } from "../src/types";

const season = (id: string, start: string, end: string): Season => ({ id, name: id, start, end, color: null });

const autumn = season("autumn", "10-15", "11-14");
const winter = season("winter", "11-15", "03-15");

describe("day of year", () => {
  it("round trips in a leap year", () => {
    expect(dayOfYear([1, 1])).toBe(1);
    expect(dayOfYear([3, 1])).toBe(61);
    expect(dayOfYear([12, 31])).toBe(366);
    expect(fromDayOfYear(60)).toEqual([2, 29]);
  });
});

describe("seasons", () => {
  it("contains dates, also across new year", () => {
    expect(seasonContains(autumn, [11, 8])).toBe(true);
    expect(seasonContains(autumn, [11, 15])).toBe(false);
    expect(seasonContains(winter, [1, 10])).toBe(true);
    expect(seasonContains(winter, [12, 31])).toBe(true);
    expect(seasonContains(winter, [3, 16])).toBe(false);
    expect(wrapsNewYear(winter)).toBe(true);
    expect(seasonRanges(winter)).toEqual([
      [dayOfYear([11, 15]), 366],
      [1, dayOfYear([3, 15])],
    ]);
  });

  it("finds the days outside every season", () => {
    expect(uncoveredRanges([autumn, winter])).toEqual([[dayOfYear([3, 16]), dayOfYear([10, 14])]]);
    expect(uncoveredRanges([season("all", "01-01", "12-31")])).toEqual([]);
  });

  it("detects overlaps", () => {
    expect(overlappingSeason(season("x", "11-10", "11-20"), [autumn, winter])?.id).toBe("autumn");
    expect(overlappingSeason(season("winter", "11-15", "03-15"), [autumn, winter])).toBeUndefined();
    expect(overlappingSeason(season("spring", "03-16", "04-15"), [autumn, winter])).toBeUndefined();
  });

  it("lists weekdays without a program", () => {
    const programs = [{ id: "a", name: "a", days: ["mon", "tue"], blocks: [] }];
    expect(freeDays(programs, ["mon", "tue", "wed"])).toEqual(["wed"]);
  });
});
