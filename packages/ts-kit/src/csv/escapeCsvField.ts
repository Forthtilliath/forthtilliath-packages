/**
 * Escapes a single CSV field per RFC 4180, quoting it only when needed: if it
 * contains a double quote, the delimiter or a line break, it's wrapped in
 * double quotes with any internal double quote doubled; otherwise it's
 * returned as-is.
 *
 * Builds rows cell by cell. To serialize whole rows at once, see `toCsv`
 * (which always quotes, and defaults to `,`).
 *
 * @param value - The raw field value.
 * @param delimiter - The cell separator the field will be joined with.
 *   Defaults to `";"`, what French-locale Excel expects.
 * @returns The value, quoted and escaped only if needed.
 * @example
 * escapeCsvField("Apple"); // => "Apple"
 * escapeCsvField("a;b"); // => '"a;b"'
 * escapeCsvField("a,b", ","); // => '"a,b"'
 * escapeCsvField('He said "hi"'); // => '"He said ""hi"""'
 */
export function escapeCsvField(value: string, delimiter = ";"): string {
  const needsQuoting =
    value.includes('"') ||
    value.includes(delimiter) ||
    value.includes("\n") ||
    value.includes("\r");
  if (!needsQuoting) return value;
  return `"${value.replace(/"/g, '""')}"`;
}
