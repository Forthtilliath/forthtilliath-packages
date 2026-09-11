import { useCallback, useMemo, useSyncExternalStore } from "react";

type Updater<T> = T | ((previous: T) => T);

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * State persisted to `localStorage`, safe to use during SSR and kept in sync
 * across tabs.
 *
 * - `initialValue` **must be stable** (a module-level constant), not an inline
 *   literal, otherwise it changes identity on every render.
 * - `hydrated` becomes `true` once the value has been read from the browser;
 *   useful to avoid a flash of the default value.
 *
 * @example
 * const { value, setValue, clear, hydrated } = usePersistentState("theme", "system");
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const value = useMemo<T>(() => {
    if (raw == null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [raw, initialValue]);

  const setValue = useCallback(
    (updater: Updater<T>) => {
      try {
        const current = readRaw(key);
        const previous =
          current == null ? initialValue : (JSON.parse(current) as T);
        const next =
          typeof updater === "function"
            ? (updater as (p: T) => T)(previous)
            : updater;
        window.localStorage.setItem(key, JSON.stringify(next));
        // The `storage` event does not fire in the tab that triggered it, so
        // it is dispatched manually to keep this hook's own subscribers in sync.
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch {
        // localStorage unavailable (private mode, quota exceeded): fail silently.
      }
    },
    [key, initialValue],
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new StorageEvent("storage", { key }));
    } catch {
      // Same as above.
    }
  }, [key]);

  return { value, setValue, clear, hydrated };
}
