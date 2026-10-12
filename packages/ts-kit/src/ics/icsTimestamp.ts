/**
 * An iCalendar UTC `DATE-TIME` (`YYYYMMDDTHHMMSSZ`), as `DTSTAMP` expects.
 *
 * @param date - The instant. @defaultValue now
 * @returns The instant in UTC, as `YYYYMMDDTHHMMSSZ`.
 * @example
 * icsTimestamp(new Date("2026-07-14T08:05:09.123Z")); // => "20260714T080509Z"
 */
export function icsTimestamp(date: Date = new Date()): string {
  return `${date.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}
