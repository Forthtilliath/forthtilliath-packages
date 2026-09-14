export interface MemoizedFunction<Args extends unknown[], R> {
  (...args: Args): R;
  /** The underlying cache, exposed for inspection or manual clearing. */
  cache: Map<string, R>;
}

/**
 * Caches the result of `fn` per argument tuple (JSON-stringified by
 * default).
 *
 * @param fn - The function to memoize.
 * @param getKey - Computes the cache key for a set of arguments (defaults to `JSON.stringify`).
 * @returns A memoized version of `fn`, with a `cache` map exposed.
 * @example
 * const square = memoize((n: number) => expensiveSquare(n));
 * square(4); // computed
 * square(4); // cached
 */
export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  getKey: (...args: Args) => string = (...args) => JSON.stringify(args),
): MemoizedFunction<Args, R> {
  const cache = new Map<string, R>();

  const memoized = ((...args: Args): R => {
    const key = getKey(...args);
    if (cache.has(key)) return cache.get(key) as R;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as MemoizedFunction<Args, R>;

  memoized.cache = cache;
  return memoized;
}
