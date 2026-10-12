// SQLite's `current_timestamp` stores UTC as "YYYY-MM-DD HH:MM:SS", with no
// zone marker: `new Date()` would read it as local time.
const SQLITE_DATETIME = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/;

/**
 * Parses a date read from SQLite. A `current_timestamp` value
 * (`"2026-10-09 19:46:00"`, UTC without a zone marker) is read as **UTC** —
 * `new Date()` would take it for local time and shift it by the time zone
 * offset. Full ISO strings (with `Z` or an offset) are read as they are.
 *
 * @param value - A SQLite datetime or a full ISO string.
 * @returns The corresponding `Date`.
 * @example
 * parseSqliteDate("2026-10-09 19:46:00").toISOString(); // => "2026-10-09T19:46:00.000Z"
 */
export function parseSqliteDate(value: string): Date {
  return new Date(
    SQLITE_DATETIME.test(value) ? `${value.replace(" ", "T")}Z` : value,
  );
}
