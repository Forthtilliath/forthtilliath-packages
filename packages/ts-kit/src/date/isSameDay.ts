/**
 * Checks whether two dates fall on the same local calendar day.
 *
 * @param a - The first date.
 * @param b - The second date.
 * @returns `true` if both dates share the same year, month and day.
 * @example
 * isSameDay(new Date("2026-03-14T08:00"), new Date("2026-03-14T22:00")); // => true
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
