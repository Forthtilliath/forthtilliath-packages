export type PeriodFilter = "all" | "today" | "7d" | "30d";

/**
 * Returns the timestamp (ms) from which a record is included for a given
 * period filter, or `null` for `"all"` (no date filter). `"today"` starts at
 * the current calendar day, not a rolling 24h window.
 *
 * @param period - The period filter.
 * @param now - The reference date. Defaults to `new Date()`.
 * @returns The period's start timestamp in ms, or `null` for `"all"`.
 * @example
 * getPeriodStartMs("today"); // => start of today, local time, in ms
 * getPeriodStartMs("7d"); // => now minus 7 days, in ms
 * getPeriodStartMs("all"); // => null
 */
export function getPeriodStartMs(
  period: PeriodFilter,
  now = new Date(),
): number | null {
  if (period === "all") return null;
  if (period === "today") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay.getTime();
  }
  const days = period === "7d" ? 7 : 30;
  return now.getTime() - days * 24 * 60 * 60 * 1000;
}
