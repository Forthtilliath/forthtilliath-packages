/**
 * Resolves after the given number of milliseconds.
 *
 * @param ms - The delay in milliseconds.
 * @example
 * await sleep(1000); // waits 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
