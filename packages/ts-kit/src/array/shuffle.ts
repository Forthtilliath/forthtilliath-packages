/**
 * Returns a shuffled copy of an array (Fisher–Yates), leaving the original
 * untouched.
 *
 * @param array - The array to shuffle.
 * @param random - Returns a number in `[0, 1)`. Defaults to `Math.random`;
 * pass a seeded generator for deterministic tests.
 * @returns A new array holding the same elements in random order.
 * @example
 * shuffle([1, 2, 3, 4]); // => e.g. [3, 1, 4, 2]
 * shuffle(["a", "b", "c"], () => 0); // => ["b", "c", "a"]
 */
export function shuffle<T>(
  array: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}
