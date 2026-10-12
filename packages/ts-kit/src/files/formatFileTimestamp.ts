export interface FormatFileTimestampOptions {
  /** Append the seconds (`HHMMSS` instead of `HHMM`). Default: `false`. */
  seconds?: boolean;
  /** Put between the date and the time. Default: `"-"`. */
  separator?: string;
}

const pad2 = (value: number) => String(value).padStart(2, "0");

/**
 * Compact, file-name-safe timestamp in **local** time, `YYYYMMDD-HHMM` by
 * default: unlike `toISOString()` (UTC, with `:` that Windows rejects), an
 * export made at 00:30 carries the day it was made on, and names built with it
 * sort chronologically in a file explorer.
 *
 * @param date - The instant to format. Default: now.
 * @param options - `seconds`, `separator` between date and time.
 * @returns The formatted timestamp.
 * @example
 * formatFileTimestamp(new Date(2026, 9, 8, 9, 2)); // => "20261008-0902"
 * formatFileTimestamp(new Date(2026, 9, 8, 9, 2, 5), { seconds: true, separator: "" });
 * // => "20261008090205"
 */
export function formatFileTimestamp(
  date: Date = new Date(),
  { seconds = false, separator = "-" }: FormatFileTimestampOptions = {},
): string {
  const day = `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
  const time = `${pad2(date.getHours())}${pad2(date.getMinutes())}${seconds ? pad2(date.getSeconds()) : ""}`;
  return `${day}${separator}${time}`;
}
