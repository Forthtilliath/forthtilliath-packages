import type { CalendarDate } from "./dateInTimeZone.js";
import { dateInTimeZone } from "./dateInTimeZone.js";

/**
 * Returns today's calendar date in a given time zone — on a server running in
 * UTC, `new Date()` is still "yesterday" in Paris between midnight and 1–2 am.
 *
 * @param timeZone - An IANA time zone, e.g. `"Europe/Paris"`.
 * @param now - The reference instant (defaults to now).
 * @returns `{ year, month, day, iso }`, `month` from 1 to 12.
 * @throws {RangeError} If the time zone is invalid.
 * @example
 * todayInTimeZone("Europe/Paris").iso; // => "2026-09-30"
 */
export function todayInTimeZone(
  timeZone: string,
  now: Date = new Date(),
): CalendarDate {
  return dateInTimeZone(now, timeZone);
}
