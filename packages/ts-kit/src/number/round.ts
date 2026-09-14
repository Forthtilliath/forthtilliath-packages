/**
 * Rounds a number to a given number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - The number of decimal places (default: 0).
 * @returns The rounded number.
 * @example
 * round(1.2345, 2); // => 1.23
 * round(1.005, 2); // => 1.01
 */
export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
