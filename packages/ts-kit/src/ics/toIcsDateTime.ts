import { toIcsDate } from "./toIcsDate.js";

/**
 * An iCalendar floating local `DATE-TIME` value (`YYYYMMDDTHHMMSS`, no `Z`)
 * from a calendar date and a wall-clock time — the calendar app shows it at
 * that time in its own time zone.
 *
 * @param isoDate - A calendar date, `YYYY-MM-DD`.
 * @param time - A time, `H:MM` or `HH:MM`.
 * @returns The date-time as `YYYYMMDDTHHMMSS`.
 * @example
 * toIcsDateTime("2026-07-14", "6:30"); // => "20260714T063000"
 */
export function toIcsDateTime(isoDate: string, time: string): string {
  const [hours = "0", minutes = "0"] = time.split(":");
  return `${toIcsDate(isoDate)}T${hours.padStart(2, "0")}${minutes.padStart(2, "0")}00`;
}
