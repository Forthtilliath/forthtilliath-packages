export interface MemoizedFunction<Args extends unknown[], R> {
  (...args: Args): R;
  /** The underlying cache, exposed for inspection or manual clearing. */
  cache: Map<string, R>;
}

export interface MemoizeOptions<Args extends unknown[]> {
  /** Computes the cache key for a set of arguments (defaults to `JSON.stringify`). */
  getKey?: (...args: Args) => string;
  /**
   * Max number of cached results; beyond it, the least recently used one is
   * evicted. Unbounded by default — set it for a long-lived function called
   * with many distinct arguments.
   */
  maxSize?: number;
}

/**
 * Caches the result of `fn` per argument tuple (JSON-stringified by
 * default).
 *
 * A returned promise that rejects is evicted from the cache, so a failed
 * async call is retried on the next invocation instead of failing forever.
 *
 * @param fn - The function to memoize.
 * @param getKeyOrOptions - A key function, or `{ getKey, maxSize }`.
 * @returns A memoized version of `fn`, with a `cache` map exposed.
 * @example
 * const square = memoize((n: number) => expensiveSquare(n));
 * square(4); // computed
 * square(4); // cached
 *
 * const getUser = memoize(fetchUser, { maxSize: 100 });
 */
export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  getKeyOrOptions: ((...args: Args) => string) | MemoizeOptions<Args> = {},
): MemoizedFunction<Args, R> {
  const {
    getKey = (...args: Args) => JSON.stringify(args),
    maxSize = Infinity,
  } =
    typeof getKeyOrOptions === "function"
      ? { getKey: getKeyOrOptions }
      : getKeyOrOptions;
  const cache = new Map<string, R>();

  const memoized = ((...args: Args): R => {
    const key = getKey(...args);
    if (cache.has(key)) {
      const cached = cache.get(key) as R;
      // Re-insert to mark it as the most recently used.
      cache.delete(key);
      cache.set(key, cached);
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    if (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) cache.delete(oldestKey);
    }
    if (result instanceof Promise) {
      result.catch(() => {
        // Only if it's still this call's promise (not a newer one).
        if (cache.get(key) === result) cache.delete(key);
      });
    }
    return result;
  }) as MemoizedFunction<Args, R>;

  memoized.cache = cache;
  return memoized;
}
