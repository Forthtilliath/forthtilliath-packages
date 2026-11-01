"use client";

import { useSyncExternalStore } from "react";

/** A toast shown by a {@link ToastStore}. */
export interface Toast<V extends string = string> {
  /** Unique within its store, to dismiss it and as a React `key`. */
  id: number;
  message: string;
  /** Free-form kind (`"error"`, `"success"`…), for the UI to style. */
  variant: V;
}

/** Options of {@link createToastStore} and of {@link ToastStore.show}. */
export interface ToastOptions {
  /**
   * How long a toast stays, in ms. `0` or `Infinity` keeps it until it is
   * dismissed. Defaults to `5000`.
   */
  durationMs?: number;
}

/** A toast queue, see {@link createToastStore}. */
export interface ToastStore<V extends string = string> {
  /** Adds a toast and returns its id. */
  show: (message: string, variant: V, options?: ToastOptions) => number;
  /** Removes a toast (no-op if it is already gone). */
  dismiss: (id: number) => void;
  /** Removes every toast. */
  clear: () => void;
  /** `useSyncExternalStore`-style subscription; returns the unsubscribe. */
  subscribe: (listener: () => void) => () => void;
  /** The current toasts, oldest first. Same array until something changes. */
  getSnapshot: () => readonly Toast<V>[];
}

const NO_TOASTS: readonly never[] = Object.freeze([]);

/**
 * A dependency-free toast queue, declared once per app at module level and
 * usable from anywhere (event handlers, `catch` blocks, outside React). The
 * rendering stays in the app: read the toasts with {@link useToasts} and
 * style them with the app's own theme.
 *
 * @param defaults - Defaults for every toast, see {@link ToastOptions}.
 * @returns The store.
 * @example
 * // lib/toast.ts
 * export const toasts = createToastStore<"error" | "success">();
 * export const toast = {
 *   error: (message: string) => toasts.show(message, "error"),
 *   success: (message: string) => toasts.show(message, "success"),
 * };
 *
 * // Toaster.tsx
 * const items = useToasts(toasts);
 * return items.map((t) => (
 *   <div key={t.id} role="alert">
 *     {t.message} <button onClick={() => toasts.dismiss(t.id)}>×</button>
 *   </div>
 * ));
 */
export function createToastStore<V extends string = string>(
  defaults: ToastOptions = {},
): ToastStore<V> {
  let toasts: readonly Toast<V>[] = NO_TOASTS;
  let nextId = 0;
  const listeners = new Set<() => void>();
  const timers = new Map<number, ReturnType<typeof setTimeout>>();

  function emit() {
    listeners.forEach((listener) => {
      listener();
    });
  }

  function dismiss(id: number) {
    clearTimeout(timers.get(id));
    timers.delete(id);
    if (!toasts.some((t) => t.id === id)) return;
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }

  return {
    show(message, variant, options = {}) {
      const id = nextId++;
      toasts = [...toasts, { id, message, variant }];
      const durationMs = options.durationMs ?? defaults.durationMs ?? 5000;
      if (durationMs > 0 && Number.isFinite(durationMs)) {
        timers.set(
          id,
          setTimeout(() => {
            dismiss(id);
          }, durationMs),
        );
      }
      emit();
      return id;
    },
    dismiss,
    clear() {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });
      timers.clear();
      if (toasts.length === 0) return;
      toasts = NO_TOASTS;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => toasts,
  };
}

function getServerSnapshot(): readonly never[] {
  return NO_TOASTS;
}

/**
 * The toasts of a {@link createToastStore} store, re-rendering when they
 * change. SSR-safe: empty on the server.
 *
 * @param store - The store, declared at module level.
 * @returns The current toasts, oldest first.
 */
export function useToasts<V extends string>(
  store: ToastStore<V>,
): readonly Toast<V>[] {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot,
  );
}
