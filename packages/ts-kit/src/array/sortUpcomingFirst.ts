export type DateInput = Date | string | number;

export interface SortUpcomingFirstOptions {
  /** Instant separating upcoming from past items. Defaults to now. */
  now?: DateInput;
}

// Upcoming items first, then past items, then items without a usable date.
const UPCOMING = 0;
const PAST = 1;
const UNDATED = 2;

function toTimes(dates: DateInput | readonly DateInput[] | null | undefined) {
  if (dates == null) return [];
  const list: readonly DateInput[] = Array.isArray(dates)
    ? dates
    : [dates as DateInput];
  return list
    .map((date) => new Date(date).getTime())
    .filter((time) => !Number.isNaN(time));
}

/**
 * Sorts items around a reference instant: upcoming items first, nearest
 * first, then past items, most recent first — the usual order for a list of
 * events (concerts, meetings, bookings…). Items without a valid date go last.
 * Ties keep their original order.
 *
 * An item may carry several dates (e.g. an event with several sessions): it
 * stays upcoming as long as one of its dates is still ahead and is ranked by
 * its next date; once all are past, it is ranked by its latest date.
 *
 * @param items - The items to sort (left untouched).
 * @param getDates - Reads the date(s) off an item (`Date`, ISO string or
 *   timestamp); `null`/`undefined` or invalid dates are ignored.
 * @param options - `now`: the reference instant (a date equal to it counts as
 *   upcoming). Defaults to now.
 * @returns A sorted copy of `items`.
 * @example
 * sortUpcomingFirst(
 *   [{ d: "2026-01-01" }, { d: "2026-12-01" }, { d: "2026-03-01" }, { d: "2026-10-01" }],
 *   (item) => item.d,
 *   { now: "2026-06-01" },
 * ); // => 2026-10-01, 2026-12-01, 2026-03-01, 2026-01-01
 */
export function sortUpcomingFirst<T>(
  items: readonly T[],
  getDates: (item: T) => DateInput | readonly DateInput[] | null | undefined,
  { now = Date.now() }: SortUpcomingFirstOptions = {},
): T[] {
  const nowTime = new Date(now).getTime();
  const keyed = items.map((item) => {
    const times = toTimes(getDates(item));
    const upcoming = times.filter((time) => time >= nowTime);
    if (upcoming.length > 0)
      return { item, group: UPCOMING, key: Math.min(...upcoming) };
    if (times.length > 0)
      return { item, group: PAST, key: -Math.max(...times) };
    return { item, group: UNDATED, key: 0 };
  });
  keyed.sort((a, b) => a.group - b.group || a.key - b.key);
  return keyed.map((k) => k.item);
}
