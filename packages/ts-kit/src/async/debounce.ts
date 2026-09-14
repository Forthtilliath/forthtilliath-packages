export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Cancels a pending invocation, if any. */
  cancel: () => void;
  /** Immediately invokes a pending call, if any. */
  flush: () => void;
}

/**
 * Returns a debounced version of `fn` that only runs after `wait`
 * milliseconds have elapsed without another call.
 *
 * @param fn - The function to debounce.
 * @param wait - The delay in milliseconds.
 * @returns The debounced function, with `cancel()` and `flush()` helpers.
 * @example
 * const onResize = debounce(() => recompute(), 200);
 * window.addEventListener("resize", onResize);
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): DebouncedFunction<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | undefined;

  const debounced = ((...args: Args): void => {
    pendingArgs = args;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      const callArgs = pendingArgs;
      pendingArgs = undefined;
      if (callArgs) fn(...callArgs);
    }, wait);
  }) as DebouncedFunction<Args>;

  debounced.cancel = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    pendingArgs = undefined;
  };

  debounced.flush = (): void => {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
    const callArgs = pendingArgs;
    pendingArgs = undefined;
    if (callArgs) fn(...callArgs);
  };

  return debounced;
}
