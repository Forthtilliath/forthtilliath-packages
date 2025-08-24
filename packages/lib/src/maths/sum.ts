/**
 * Calculates the sum of all numbers in an array.
 *
 * @param {number[]} arr - The array of numbers to sum.
 * @return {number} The sum of all numbers in the array.
 */
export function sum(arr: number[]): number {
  return arr.reduce((total, n) => total + n, 0);
}
