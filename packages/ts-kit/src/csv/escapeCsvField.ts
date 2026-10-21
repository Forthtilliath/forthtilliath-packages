import {
  type CsvFormulaOptions,
  neutralizeCsvFormula,
} from "./neutralizeCsvFormula.js";

/**
 * Escapes a single CSV field per RFC 4180, quoting it only when needed: if it
 * contains a double quote, the delimiter or a line break, it's wrapped in
 * double quotes with any internal double quote doubled; otherwise it's
 * returned as-is. A field that would run as a spreadsheet formula (`=`, `+`,
 * `-`, `@`…) is first prefixed with `'` (see `neutralizeCsvFormula`).
 *
 * Builds rows cell by cell. To serialize whole rows at once, see `toCsv`
 * (which always quotes, and defaults to `,`).
 *
 * @param value - The raw field value.
 * @param delimiter - The cell separator the field will be joined with.
 *   Defaults to `";"`, what French-locale Excel expects.
 * @param options - `{ neutralizeFormulas }`, `true` by default.
 * @returns The value, quoted and escaped only if needed.
 * @example
 * escapeCsvField("Apple"); // => "Apple"
 * escapeCsvField("a;b"); // => '"a;b"'
 * escapeCsvField("a,b", ","); // => '"a,b"'
 * escapeCsvField('He said "hi"'); // => '"He said ""hi"""'
 * escapeCsvField("=1+1"); // => "'=1+1"
 */
export function escapeCsvField(
  value: string,
  delimiter = ";",
  { neutralizeFormulas = true }: CsvFormulaOptions = {},
): string {
  const safe = neutralizeFormulas ? neutralizeCsvFormula(value) : value;
  const needsQuoting =
    safe.includes('"') ||
    safe.includes(delimiter) ||
    safe.includes("\n") ||
    safe.includes("\r");
  if (!needsQuoting) return safe;
  return `"${safe.replace(/"/g, '""')}"`;
}
