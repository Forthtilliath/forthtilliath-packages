import { parseIsoDate } from "./parseIsoDate.js";

/**
 * Day of the week with Monday as the first day: `0` for Monday … `6` for
 * Sunday (instead of JavaScript's Sunday = `0`). Handy to offset the first
 * day of a month in a Monday-first calendar grid.
 *
 * @param date - A `Date`, or a `YYYY-MM-DD` calendar date read as local midnight.
 * @returns The weekday index, Monday = `0`.
 * @example
 * mondayFirstWeekday("2026-10-01"); // => 3 (a Thursday)
 */
export function mondayFirstWeekday(date: Date | string): number {
  const day = (typeof date === "string" ? parseIsoDate(date) : date).getDay();
  return (day + 6) % 7;
}
