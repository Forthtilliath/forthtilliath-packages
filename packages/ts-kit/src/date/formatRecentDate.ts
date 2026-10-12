import { startOfDay } from "./startOfDay.js";

/** Languages {@link formatRecentDate} has wording for. */
export type RecentDateLocale = "fr" | "en";

export interface FormatRecentDateOptions {
  /** Reference "now" (defaults to the current time). */
  now?: Date;
  /** Wording and `Intl` formats. @defaultValue "fr" */
  locale?: RecentDateLocale;
}

const WORDING: Record<
  RecentDateLocale,
  {
    tag: string;
    today: (time: string) => string;
    yesterday: (time: string) => string;
    older: (day: string) => string;
  }
> = {
  fr: {
    tag: "fr-FR",
    today: (time) => `aujourd'hui à ${time}`,
    yesterday: (time) => `hier à ${time}`,
    older: (day) => `le ${day}`,
  },
  en: {
    tag: "en-US",
    today: (time) => `today at ${time}`,
    yesterday: (time) => `yesterday at ${time}`,
    older: (day) => `on ${day}`,
  },
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Describes a past moment the way a "last saved…" line reads best: with the
 * time when it's today or yesterday, as a plain day otherwise. A date in the
 * future (clock change between devices) reads as today.
 *
 * @param date - The moment to describe.
 * @param options - See {@link FormatRecentDateOptions}.
 * @returns E.g. `"aujourd'hui à 21:42"`, `"hier à 08:05"`, `"le 11 octobre 2026"`.
 * @example
 * formatRecentDate(lastBackupAt); // => "hier à 21:42"
 * formatRecentDate(lastBackupAt, { locale: "en" }); // => "yesterday at 9:42 PM"
 */
export function formatRecentDate(
  date: Date,
  { now = new Date(), locale = "fr" }: FormatRecentDateOptions = {},
): string {
  const wording = WORDING[locale];
  // Rounded: a day that has a DST change lasts 23 or 25 hours.
  const dayDiff = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / DAY_MS,
  );
  if (dayDiff <= 1) {
    const time = new Intl.DateTimeFormat(wording.tag, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    return dayDiff === 1 ? wording.yesterday(time) : wording.today(time);
  }
  const day = new Intl.DateTimeFormat(wording.tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return wording.older(day);
}
