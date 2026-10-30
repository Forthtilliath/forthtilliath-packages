/**
 * Returns one element of an array, picked at random (each equally likely).
 *
 * @param array - The array to pick from.
 * @param random - Returns a number in `[0, 1)`. Defaults to `Math.random`;
 * pass a seeded generator for deterministic tests.
 * @returns The picked element, or `undefined` if `array` is empty.
 * @example
 * pickRandom(["rock", "paper", "scissors"]); // => e.g. "paper"
 * pickRandom([1, 2, 3], () => 0.99); // => 3
 * pickRandom([]); // => undefined
 */
export function pickRandom<T>(
  array: readonly T[],
  random: () => number = Math.random,
): T | undefined {
  return array[Math.floor(random() * array.length)];
}
