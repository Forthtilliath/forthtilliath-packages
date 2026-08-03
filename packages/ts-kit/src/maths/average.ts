import { sum } from "./sum.js";

/**
 * Calculates the average of all numbers in an array.
 *
 * @param {number[]} arr - The array of numbers to average.
 * @return {number} The average of all numbers in the array.
 */
export function avg(arr: number[]): number {
  return sum(arr) / arr.length;
}
