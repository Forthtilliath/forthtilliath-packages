/**
 * Escapes a value for an iCalendar (RFC 5545) TEXT property — `SUMMARY`,
 * `DESCRIPTION`, `LOCATION`…: backslashes, semicolons and commas get a
 * backslash, line breaks become a literal `\n`.
 *
 * @param text - The raw text.
 * @returns The text, safe to put after `SUMMARY:` and the like.
 * @example
 * escapeIcsText("Matin; puis soir, à 20h"); // => "Matin\\; puis soir\\, à 20h"
 */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}
