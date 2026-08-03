/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to chunk.
 * @param size - The size of each chunk.
 * @returns An array of arrays containing the chunked elements.
 * @example
 * chunk([1, 2, 3, 4, 5], 2); // => [[1, 2], [3, 4], [5]]
 * chunk([1, 2, 3, 4, 5], 3); // => [[1, 2, 3], [4, 5]]
 * chunk([1, 2, 3, 4, 5], 6); // => [[1, 2, 3, 4, 5]]
 * chunk([1, 2, 3, 4, 5], 0); // => []
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
