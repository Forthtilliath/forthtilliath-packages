/**
 * Parses a `YYYY-MM-DD` calendar date as **local** midnight — unlike
 * `new Date("2026-03-14")`, which the spec reads as UTC midnight and which
 * therefore lands on the previous day west of Greenwich.
 *
 * @param iso - A calendar date, `YYYY-MM-DD`.
 * @returns A `Date` at local midnight on that day.
 * @example
 * parseIsoDate("2026-03-14").getDate(); // => 14, whatever the time zone
 */
export function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}
