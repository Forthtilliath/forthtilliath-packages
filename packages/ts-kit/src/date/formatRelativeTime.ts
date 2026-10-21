type Unit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

const UNITS: { unit: Unit; ms: number }[] = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

const FRENCH_UNITS: Record<Unit, [string, string]> = {
  year: ["an", "ans"],
  month: ["mois", "mois"],
  week: ["semaine", "semaines"],
  day: ["jour", "jours"],
  hour: ["heure", "heures"],
  minute: ["minute", "minutes"],
  second: ["seconde", "secondes"],
};

// Hermes (React Native on Android) ships no `Intl.RelativeTimeFormat`: this
// covers French and English (any other locale gets English).
function formatWithoutIntl(value: number, unit: Unit, locale: string): string {
  const abs = Math.abs(value);
  if (locale.split("-")[0]?.toLowerCase() === "fr") {
    if (value === 0) return "maintenant";
    if (unit === "day" && abs === 1) return value < 0 ? "hier" : "demain";
    const [one, many] = FRENCH_UNITS[unit];
    const text = `${abs} ${abs < 2 ? one : many}`;
    return value < 0 ? `il y a ${text}` : `dans ${text}`;
  }
  if (value === 0) return "now";
  if (unit === "day" && abs === 1) return value < 0 ? "yesterday" : "tomorrow";
  const text = `${abs} ${unit}${abs === 1 ? "" : "s"}`;
  return value < 0 ? `${text} ago` : `in ${text}`;
}

/**
 * Formats the difference between two dates as a human-readable relative
 * string ("3 hours ago", "in 2 days"), backed by `Intl.RelativeTimeFormat`.
 * Where the engine lacks it (Hermes on Android), a built-in fallback covers
 * French and English, and formats any other locale in English.
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
  const format =
    typeof Intl !== "undefined" && typeof Intl.RelativeTimeFormat === "function"
      ? (value: number, unit: Unit) =>
          new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
            value,
            unit,
          )
      : (value: number, unit: Unit) => formatWithoutIntl(value, unit, locale);

  for (const { unit, ms } of UNITS) {
    if (Math.abs(diffMs) >= ms || unit === "second") {
      // `+ 0` turns a rounded -0 into 0.
      return format(Math.round(diffMs / ms) + 0, unit);
    }
  }

  return format(0, "second");
}
