/**
 * Pure schedule logic, mirroring the Python model: a day is a list of
 * back-to-back blocks from 00:00 to 24:00 on a 15 minute grid.
 */
import type { Block } from "./types";

export const SLOT = 15;
export const MAX_BLOCK_NAME = 30;
export const DAY = 24 * 60;
export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export interface Segment {
  start: number;
  end: number;
  temperature: number | null;
  name?: string | null;
}

export const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const toTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Blocks with explicit end times. */
export const toSegments = (blocks: Block[]): Segment[] =>
  blocks.map((block, index) => ({
    start: toMinutes(block.start),
    end: index + 1 < blocks.length ? toMinutes(blocks[index + 1].start) : DAY,
    temperature: block.temperature,
    ...(block.name ? { name: block.name } : {}),
  }));

const fromSegments = (segments: Segment[]): Block[] =>
  segments
    .filter((segment) => segment.end > segment.start)
    .sort((a, b) => a.start - b.start)
    .map((segment) => {
      const block: Block = { start: toTime(segment.start), temperature: segment.temperature };
      if (segment.name) block.name = segment.name;
      return block;
    });

/** Overwrite [start, end) with a temperature; overlapped blocks are trimmed or removed. */
const paint = (
  segments: Segment[],
  start: number,
  end: number,
  temperature: number | null,
  name: string | null = null,
): Segment[] => {
  const result: Segment[] = [];
  for (const segment of segments) {
    if (segment.end <= start || segment.start >= end) {
      result.push(segment);
      continue;
    }
    if (segment.start < start) result.push({ ...segment, end: start });
    if (segment.end > end) result.push({ ...segment, start: end });
  }
  result.push(name ? { start, end, temperature, name } : { start, end, temperature });
  return result;
};

export const isValidRange = (start: number, end: number): boolean =>
  start >= 0 && end <= DAY && end - start >= SLOT && start % SLOT === 0 && end % SLOT === 0;

/** Add a block, like Tado: blocks it overlaps are shortened or removed. */
export const insertBlock = (
  blocks: Block[],
  start: number,
  end: number,
  temperature: number | null,
): Block[] => {
  if (!isValidRange(start, end)) throw new Error("invalid time range");
  return fromSegments(paint(toSegments(blocks), start, end, temperature));
};

/**
 * Change a block. Its neighbours grow into time it no longer covers and are
 * overwritten where it now reaches into them. The first block always starts
 * at 00:00 and the last one always ends at 24:00.
 */
export const updateBlock = (
  blocks: Block[],
  index: number,
  start: number,
  end: number,
  temperature: number | null,
): Block[] => {
  const segments = toSegments(blocks);
  const last = segments.length - 1;
  const old = segments[index];
  if (index === 0) start = 0;
  if (index === last) end = DAY;
  if (!isValidRange(start, end)) throw new Error("invalid time range");

  if (index > 0 && start > old.start) {
    segments[index - 1] = { ...segments[index - 1], end: Math.min(start, old.end) };
  }
  if (index < last && end < old.end) {
    segments[index + 1] = { ...segments[index + 1], start: Math.max(end, old.start) };
  }
  const rest = segments.filter((_, i) => i !== index);
  return fromSegments(paint(rest, start, end, temperature, old.name));
};

/** Remove a block; the block before it (or after it, for the first) takes its time. */
export const deleteBlock = (blocks: Block[], index: number): Block[] => {
  if (blocks.length <= 1) return blocks;
  const segments = toSegments(blocks);
  const removed = segments[index];
  if (index > 0) {
    segments[index - 1] = { ...segments[index - 1], end: removed.end };
  } else {
    segments[1] = { ...segments[1], start: 0 };
  }
  return fromSegments(segments.filter((_, i) => i !== index));
};

export const validateDay = (blocks: Block[]): boolean => {
  if (!blocks.length || blocks[0].start !== "00:00") return false;
  const starts = blocks.map((block) => toMinutes(block.start));
  return starts.every(
    (start, i) => start % SLOT === 0 && start < DAY && (i === 0 || start - starts[i - 1] >= SLOT),
  );
};

/** The days of the week in display order, starting on the locale's first weekday (Monday = 0). */
export const orderedDays = (firstWeekday: number): string[] => [
  ...WEEKDAYS.slice(firstWeekday),
  ...WEEKDAYS.slice(0, firstWeekday),
];

/**
 * Move the start of block `index` (the divider before it), keeping every
 * block at least one slot long.
 */
export const moveBoundary = (blocks: Block[], index: number, minutes: number): Block[] => {
  if (index <= 0 || index >= blocks.length) return blocks;
  const segments = toSegments(blocks);
  const low = segments[index - 1].start + SLOT;
  const high = segments[index].end - SLOT;
  const snapped = Math.round(minutes / SLOT) * SLOT;
  const value = Math.min(high, Math.max(low, snapped));
  return blocks.map((block, i) => (i === index ? { ...block, start: toTime(value) } : block));
};

/** Split a block in two halves on the slot grid; null when it is too short. */
export const splitBlock = (blocks: Block[], index: number): Block[] | null => {
  const segment = toSegments(blocks)[index];
  if (!segment || segment.end - segment.start < 2 * SLOT) return null;
  const middle = Math.round((segment.start + segment.end) / 2 / SLOT) * SLOT;
  const copy = [...blocks];
  copy.splice(index + 1, 0, { start: toTime(middle), temperature: segment.temperature });
  return copy;
};

export const setBlockTemperature = (blocks: Block[], index: number, temperature: number | null): Block[] =>
  blocks.map((block, i) => (i === index ? { ...block, temperature } : block));

/** Name a block; an empty name removes it. */
export const setBlockName = (blocks: Block[], index: number, name: string): Block[] =>
  blocks.map((block, i) => {
    if (i !== index) return block;
    const trimmed = name.trim().slice(0, MAX_BLOCK_NAME);
    const { name: _old, ...rest } = block;
    return trimmed ? { ...rest, name: trimmed } : rest;
  });
