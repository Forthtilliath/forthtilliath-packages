"use client";

import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value`: it only updates once `value` has
 * stopped changing for `delayMs`. Useful to avoid firing a request/filter on
 * every keystroke of a search input.
 *
 * @example
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 300);
 * useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, delayMs);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delayMs]);

  return debounced;
}
