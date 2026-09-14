export interface ThrottledFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Cancels any pending trailing invocation. */
  cancel: () => void;
}

/**
 * Returns a throttled version of `fn` that runs at most once every `wait`
 * milliseconds: immediately on the first call (leading edge), then once more
 * at the end of the window if further calls came in during it (trailing
 * edge).
 *
 * @param fn - The function to throttle.
 * @param wait - The minimum delay in milliseconds between calls.
 * @returns The throttled function, with a `cancel()` helper.
 * @example
 * const onScroll = throttle(() => updatePosition(), 100);
 * window.addEventListener("scroll", onScroll);
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): ThrottledFunction<Args> {
  let lastCallTime: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | undefined;

  const throttled = ((...args: Args): void => {
    const now = Date.now();
    if (lastCallTime === undefined || now - lastCallTime >= wait) {
      lastCallTime = now;
      fn(...args);
      return;
    }

    pendingArgs = args;
    timer ??= setTimeout(
      () => {
        lastCallTime = Date.now();
        timer = undefined;
        const callArgs = pendingArgs;
        pendingArgs = undefined;
        if (callArgs) fn(...callArgs);
      },
      wait - (now - lastCallTime),
    );
  }) as ThrottledFunction<Args>;

  throttled.cancel = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    pendingArgs = undefined;
    lastCallTime = undefined;
  };

  return throttled;
}
