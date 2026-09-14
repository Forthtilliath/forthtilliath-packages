/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns `value`, or the nearest bound if it falls outside `[min, max]`.
 * @example
 * clamp(15, 0, 10); // => 10
 * clamp(-5, 0, 10); // => 0
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
