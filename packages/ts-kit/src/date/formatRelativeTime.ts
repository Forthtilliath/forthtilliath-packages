const UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

/**
 * Formats the difference between two dates as a human-readable relative
 * string ("3 hours ago", "in 2 days"), backed by `Intl.RelativeTimeFormat`.
 *
 * @param date - The date to describe.
 * @param baseDate - The reference date to compare against (defaults to now).
 * @param locale - The locale to format with (defaults to `"en"`).
 * @returns The formatted relative time.
 * @example
 * formatRelativeTime(new Date(Date.now() - 3_600_000)); // => "1 hour ago"
 */
export function formatRelativeTime(
  date: Date,
  baseDate: Date = new Date(),
  locale = "en",
): string {
  const diffMs = date.getTime() - baseDate.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const { unit, ms } of UNITS) {
    if (Math.abs(diffMs) >= ms || unit === "second") {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }

  return rtf.format(0, "second");
}
