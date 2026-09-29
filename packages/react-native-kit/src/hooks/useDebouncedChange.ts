import { useEffect, useRef } from "react";

// Fires `callback` `delayMs` after the last change among `values`, ignoring
// every render while at least one value is `undefined` (e.g. data not loaded
// yet) and the very first render where they're all defined (so it doesn't
// fire on mount). The delay restarts if a new value arrives before it
// expires (a true debounce). `values` must keep the same length across
// renders, like a regular useEffect dependency array.
export function useDebouncedChange(
  values: unknown[],
  delayMs: number,
  callback: () => void,
) {
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (values.some((value) => value === undefined)) return;

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    const timeout = setTimeout(callback, delayMs);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps -- `values` IS the dependency list, by design (caller-provided, variable length not expected to change).
  }, values);
}
