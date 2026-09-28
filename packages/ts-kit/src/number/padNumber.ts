/**
 * Left-pads a number with zeros so that file names sort correctly in a file
 * explorer (`"01"`, `"02"`, …, `"10"`). The width adapts to `total` (3 digits
 * from 100 items on) and never goes below `minWidth`.
 *
 * @param n - The number to pad.
 * @param total - The total count, used to compute the width.
 * @param minWidth - The minimum width (default: 2).
 * @returns The zero-padded number.
 * @example
 * padNumber(1, 12); // => "01"
 * padNumber(7, 120); // => "007"
 */
export function padNumber(n: number, total: number, minWidth = 2): string {
  return String(n).padStart(Math.max(minWidth, String(total).length), "0");
}
