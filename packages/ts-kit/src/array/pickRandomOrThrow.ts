import { pickRandom } from "./pickRandom.js";

/**
 * Like {@link pickRandom}, but throws on an empty array instead of returning
 * `undefined` — for a list that can only be empty through a bug (an
 * unfiltered pool, a non-empty team), so the caller gets a plain `T`.
 *
 * @param array - The array to pick from.
 * @param random - Returns a number in `[0, 1)`. Defaults to `Math.random`;
 * pass `secureRandom` for an unpredictable draw.
 * @returns The picked element.
 * @throws {RangeError} When `array` is empty.
 * @example
 * pickRandomOrThrow(["rock", "paper", "scissors"]); // => e.g. "paper"
 * pickRandomOrThrow([]); // throws RangeError
 */
export function pickRandomOrThrow<T>(
  array: readonly T[],
  random: () => number = Math.random,
): T {
  if (array.length === 0) {
    throw new RangeError("pickRandomOrThrow: cannot pick from an empty array");
  }
  return pickRandom(array, random) as T;
}
