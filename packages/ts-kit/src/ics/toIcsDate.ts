/**
 * An iCalendar `DATE` value (`YYYYMMDD`) from a `YYYY-MM-DD` calendar date,
 * for all-day events (`DTSTART;VALUE=DATE:…`).
 *
 * @param isoDate - A calendar date, `YYYY-MM-DD`.
 * @returns The date as `YYYYMMDD`.
 * @example
 * toIcsDate("2026-07-14"); // => "20260714"
 */
export function toIcsDate(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}
