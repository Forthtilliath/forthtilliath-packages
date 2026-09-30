import { dateInTimeZone } from "./dateInTimeZone.js";

const DAY_MS = 24 * 60 * 60 * 1000;

function dayNumber(date: Date | number | string, timeZone: string): number {
  const { year, month, day } = dateInTimeZone(date, timeZone);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

/**
 * Counts the calendar days between today and a date, both taken in a given
 * time zone: the time of day doesn't matter, only the date on the calendar.
 *
 * @param date - The target instant (a `Date`, a timestamp in ms or a parsable string).
 * @param timeZone - An IANA time zone, e.g. `"Europe/Paris"`.
 * @param now - The reference instant (defaults to now).
 * @returns `0` today, `1` tomorrow, `-1` yesterday…
 * @throws {RangeError} If the time zone or the date is invalid.
 * @example
 * // It's 2026-03-14 23:00 in Paris
 * daysUntil("2026-03-15T08:00:00+01:00", "Europe/Paris"); // => 1
 */
export function daysUntil(
  date: Date | number | string,
  timeZone: string,
  now: Date = new Date(),
): number {
  return dayNumber(date, timeZone) - dayNumber(now, timeZone);
}
