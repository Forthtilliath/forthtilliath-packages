/**
 * Formats a number as a raw value (no unit suffix) for use in a spreadsheet
 * (sum, average...), with a comma decimal separator as expected by
 * French-locale spreadsheets instead of JS's dot.
 *
 * @param value - The number to format.
 * @param decimals - Number of decimal places. Defaults to `1`.
 * @returns The formatted number, comma as decimal separator.
 * @example
 * formatCsvNumber(1.5); // => "1,5"
 * formatCsvNumber(12.345, 2); // => "12,35"
 */
export function formatCsvNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace(".", ",");
}
