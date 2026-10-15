"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type Updater<T> = T | ((previous: T) => T);

/**
 * Any validator exposing a zod-style `safeParse` (zod, or a hand-written one).
 * Kept structural so the hook does not depend on a validation library.
 */
export interface PersistentStateSchema<T> {
  safeParse: (
    input: unknown,
  ) => { success: true; data: T } | { success: false };
}

export interface PersistentStateOptions<T> {
  /** Checks the stored value on every read; must be stable (module-level). */
  schema?: PersistentStateSchema<T>;
}

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

/** Stored value, or `initialValue` when it is missing, corrupted or rejected. */
function parseStored<T>(
  raw: string | null,
  initialValue: T,
  schema: PersistentStateSchema<T> | undefined,
): T {
  if (raw == null) return initialValue;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return initialValue;
  }
  if (!schema) return parsed as T;
  const result = schema.safeParse(parsed);
  return result.success ? result.data : initialValue;
}

/**
 * State persisted to `localStorage`, safe to use during SSR and kept in sync
 * across tabs.
 *
 * - `initialValue` **must be stable** (a module-level constant), not an inline
 *   literal, otherwise it changes identity on every render.
 * - `hydrated` becomes `true` once the value has been read from the browser;
 *   useful to avoid a flash of the default value.
 * - `options.schema` validates the stored value (anyone can edit
 *   `localStorage`, and older app versions may have stored another shape).
 *   A rejected value is replaced by `initialValue`, never applied. Without a
 *   schema, the stored JSON is trusted as `T`.
 *
 * @example
 * const { value, setValue, clear, hydrated } = usePersistentState("theme", "system");
 * const { value } = usePersistentState("settings", DEFAULTS, { schema: settingsSchema });
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  options: PersistentStateOptions<T> = {},
) {
  const { schema } = options;
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

  const value = useMemo<T>(
    () => parseStored(raw, initialValue, schema),
    [raw, initialValue, schema],
  );

  const setValue = useCallback(
    (updater: Updater<T>) => {
      try {
        const previous = parseStored(readRaw(key), initialValue, schema);
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
    [key, initialValue, schema],
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
