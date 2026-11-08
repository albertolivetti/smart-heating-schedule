/** Seasons are yearly date ranges ("MM-DD"); ranges may wrap around new year. */
import type { Program, Season } from "./types";

export type MonthDay = [number, number];

// Days per month in a leap year, so 29 February is a valid boundary.
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const YEAR_DAYS = 366;

export const parseMonthDay = (value: string): MonthDay => {
  const [month, day] = value.split("-").map(Number);
  return [month, day];
};

export const formatMonthDayValue = ([month, day]: MonthDay): string =>
  `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** Day of a leap year, 1 January = 1. */
export const dayOfYear = ([month, day]: MonthDay): number =>
  MONTH_DAYS.slice(0, month - 1).reduce((sum, days) => sum + days, 0) + day;

export const fromDayOfYear = (index: number): MonthDay => {
  let rest = index;
  let month = 0;
  while (rest > MONTH_DAYS[month]) {
    rest -= MONTH_DAYS[month];
    month++;
  }
  return [month + 1, rest];
};

const compare = (a: MonthDay, b: MonthDay): number => a[0] - b[0] || a[1] - b[1];

export const seasonContains = (season: Season, date: MonthDay): boolean => {
  const start = parseMonthDay(season.start);
  const end = parseMonthDay(season.end);
  if (compare(start, end) <= 0) return compare(start, date) <= 0 && compare(date, end) <= 0;
  return compare(date, start) >= 0 || compare(date, end) <= 0;
};

export const wrapsNewYear = (season: Season): boolean =>
  compare(parseMonthDay(season.start), parseMonthDay(season.end)) > 0;

/** Ranges of day-of-year indexes [first, last], split at new year. */
export const seasonRanges = (season: Season): [number, number][] => {
  const start = dayOfYear(parseMonthDay(season.start));
  const end = dayOfYear(parseMonthDay(season.end));
  return start <= end ? [[start, end]] : [[start, YEAR_DAYS], [1, end]];
};

/** Day-of-year ranges that belong to no season. */
export const uncoveredRanges = (seasons: Season[]): [number, number][] => {
  const covered = new Array<boolean>(YEAR_DAYS + 1).fill(false);
  for (const season of seasons) {
    for (const [first, last] of seasonRanges(season)) {
      for (let day = first; day <= last; day++) covered[day] = true;
    }
  }
  const gaps: [number, number][] = [];
  let day = 1;
  while (day <= YEAR_DAYS) {
    if (covered[day]) {
      day++;
      continue;
    }
    let last = day;
    while (last + 1 <= YEAR_DAYS && !covered[last + 1]) last++;
    gaps.push([day, last]);
    day = last + 1;
  }
  return gaps;
};

/** The other season a season overlaps, if any. */
export const overlappingSeason = (season: Season, others: Season[]): Season | undefined => {
  const days = new Set<number>();
  for (const [first, last] of seasonRanges(season)) {
    for (let day = first; day <= last; day++) days.add(day);
  }
  return others.find(
    (other) =>
      other.id !== season.id &&
      seasonRanges(other).some(([first, last]) => {
        for (let day = first; day <= last; day++) if (days.has(day)) return true;
        return false;
      }),
  );
};

/** Localized "15 ottobre" / "15 Oct". */
export const formatMonthDay = (value: string, language: string, month: "long" | "short" = "long"): string => {
  const [m, d] = parseMonthDay(value);
  return new Intl.DateTimeFormat(language, { day: "numeric", month }).format(new Date(2024, m - 1, d));
};

export const monthNames = (language: string): string[] =>
  Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(language, { month: "narrow" }).format(new Date(2024, month, 1)),
  );

export const monthWidths = (): number[] => MONTH_DAYS.map((days) => days / YEAR_DAYS);

export const randomId = (): string => Math.random().toString(36).slice(2, 10);

/** Weekdays that belong to no program. */
export const freeDays = (programs: Program[], weekdays: readonly string[]): string[] =>
  weekdays.filter((day) => !programs.some((program) => program.days.includes(day)));

export const SEASON_COLORS = ["#2f6fca", "#23794a", "#b7791f", "#a85b14", "#7a4cc2", "#b23a48"];
