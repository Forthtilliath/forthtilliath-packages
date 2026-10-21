// A number written as text ("-3", "+33 6", "1,5", "2e-3") stays a number.
const NUMERIC = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)([eE][+-]?\d+)?$/;
const FORMULA_START = /^[=+\-@\t\r]/;

/**
 * Defuses CSV/formula injection: a text cell that starts with `=`, `+`, `-`,
 * `@`, a tab or a carriage return is run as a formula by Excel, LibreOffice
 * or Sheets (`=HYPERLINK("http://…","click")` becomes a trapped link). Such a
 * cell is prefixed with an apostrophe so the spreadsheet shows it as text.
 * Numbers written as text (`"-3"`, `"+1,5"`) are left untouched.
 *
 * `toCsv` and `escapeCsvField` already call it by default.
 *
 * @param value - The raw cell value.
 * @returns The value, prefixed with `'` if it would run as a formula.
 * @example
 * neutralizeCsvFormula("=1+1"); // => "'=1+1"
 * neutralizeCsvFormula("@SUM(A1)"); // => "'@SUM(A1)"
 * neutralizeCsvFormula("-3"); // => "-3"
 * neutralizeCsvFormula("Ann"); // => "Ann"
 */
export function neutralizeCsvFormula(value: string): string {
  if (!FORMULA_START.test(value) || NUMERIC.test(value)) return value;
  return `'${value}`;
}

export interface CsvFormulaOptions {
  /**
   * Prefixes with `'` the text cells a spreadsheet would run as formulas (see
   * `neutralizeCsvFormula`). Defaults to `true`; turn it off only for a file
   * no spreadsheet will open, or whose cells are not user input.
   */
  neutralizeFormulas?: boolean;
}
