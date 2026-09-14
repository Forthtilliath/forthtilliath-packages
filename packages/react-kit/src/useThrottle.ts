"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a throttled copy of `value`: it updates at most once per
 * `limitMs`, immediately on the first change then on a trailing edge so the
 * final value is never dropped. Useful for high-frequency sources (scroll
 * position, window size, cursor position) that would otherwise re-render on
 * every event.
 *
 * @example
 * const scrollY = useWindowScrollY(); // arbitrary fast-changing value
 * const throttledScrollY = useThrottle(scrollY, 200);
 */
export function useThrottle<T>(value: T, limitMs: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastRanAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastRanAtRef.current === null) {
      // First run: nothing to throttle against yet, just record the
      // baseline so the *next* change is measured from here.
      lastRanAtRef.current = Date.now();
      return;
    }

    const elapsed = Date.now() - lastRanAtRef.current;
    if (elapsed >= limitMs) {
      lastRanAtRef.current = Date.now();
      // Leading edge: the limit has already elapsed, so this change must
      // apply right away rather than waiting for a trailing timeout.
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      setThrottled(value);
      return;
    }

    const timeout = setTimeout(() => {
      lastRanAtRef.current = Date.now();
      setThrottled(value);
    }, limitMs - elapsed);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, limitMs]);

  return throttled;
}
