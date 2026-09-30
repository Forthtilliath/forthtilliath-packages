export interface CalendarDate {
  year: number;
  /** 1–12. */
  month: number;
  day: number;
  /** `YYYY-MM-DD`. */
  iso: string;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let result = formatters.get(timeZone);
  if (!result) {
    result = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    formatters.set(timeZone, result);
  }
  return result;
}

/**
 * Returns the calendar date of an instant in a given time zone, whatever the
 * machine's own time zone (e.g. a server running in UTC).
 *
 * @param date - The instant (a `Date`, a timestamp in ms or a parsable string).
 * @param timeZone - An IANA time zone, e.g. `"Europe/Paris"`.
 * @returns `{ year, month, day, iso }`, `month` from 1 to 12.
 * @throws {RangeError} If the time zone or the date is invalid.
 * @example
 * dateInTimeZone("2026-03-14T23:30:00Z", "Europe/Paris");
 * // => { year: 2026, month: 3, day: 15, iso: "2026-03-15" }
 */
export function dateInTimeZone(
  date: Date | number | string,
  timeZone: string,
): CalendarDate {
  const parts = formatter(timeZone).formatToParts(new Date(date));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { year, month, day, iso };
}
