import { sum } from "./sum.js";

/**
 * Calculates the average (arithmetic mean) of all numbers in an array.
 *
 * @param arr - The numbers to average.
 * @returns The average, or `NaN` for an empty array — there's no meaningful
 *   average of nothing, and `0` would be indistinguishable from a real one
 *   (same as lodash's `mean`). Check `arr.length` first if you need a fallback.
 * @example
 * avg([1, 2, 3]); // => 2
 * avg([]); // => NaN
 */
export function avg(arr: readonly number[]): number {
  return sum(arr) / arr.length;
}
