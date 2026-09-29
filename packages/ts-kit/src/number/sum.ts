/**
 * Calculates the sum of all numbers in an array.
 *
 * @param arr - The numbers to add up.
 * @returns Their sum, `0` for an empty array.
 * @example
 * sum([1, 2, 3]); // => 6
 */
export function sum(arr: readonly number[]): number {
  return arr.reduce((total, n) => total + n, 0);
}
