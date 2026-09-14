/**
 * Returns a new `Date` set to midnight (00:00:00.000) of the same local day.
 *
 * @param date - The reference date (defaults to now).
 * @returns A new `Date` at the start of that day.
 * @example
 * startOfDay(new Date("2026-03-14T18:30:00")); // => 2026-03-14T00:00:00.000
 */
export function startOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}
