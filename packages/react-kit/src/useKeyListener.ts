"use client";

import { useEffect, useRef } from "react";

export interface KeyConfig {
  /** `KeyboardEvent.key` to match (e.g. `"s"`, `"Escape"`). Any key when omitted. */
  key?: string;
  /** Ctrl must be held (`true`) or not (`false`, the default). */
  ctrl?: boolean;
  /**
   * Shift must be held (`true`) or not (`false`). Ignored when omitted: Shift
   * is often needed to type the key itself (`"?"`, uppercase letters…).
   */
  shift?: boolean;
  /** Alt/Option must be held (`true`) or not (`false`, the default). */
  alt?: boolean;
  /** Meta/Cmd must be held (`true`) or not (`false`, the default). */
  meta?: boolean;
}

/** `KeyboardEvent.key` values of common non-printable keys. */
export const SPECIAL_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  BACKSPACE: "Backspace",
  TAB: "Tab",
} as const;

/**
 * Calls `onKeyDown` on every `window` `keydown` matching `config`. Ctrl, Alt
 * and Meta must match exactly — `{ key: "s" }` doesn't fire on Ctrl+S, which
 * would clash with the browser's own shortcut — while Shift is only checked
 * when specified.
 *
 * `onKeyDown` can be an inline function: the listener isn't re-attached when
 * it changes, only when `config`'s values do.
 *
 * @example
 * useKeyListener({ key: "k", ctrl: true }, (event) => {
 *   event.preventDefault();
 *   openCommandPalette();
 * });
 * useKeyListener({ key: SPECIAL_KEYS.ESCAPE }, close);
 */
export function useKeyListener(
  config: KeyConfig,
  onKeyDown: (event: KeyboardEvent) => void,
) {
  const onKeyDownRef = useRef(onKeyDown);
  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);

  const { key, ctrl = false, shift, alt = false, meta = false } = config;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (key !== undefined && event.key !== key) return;
      if (
        event.ctrlKey !== ctrl ||
        event.altKey !== alt ||
        event.metaKey !== meta
      )
        return;
      if (shift !== undefined && event.shiftKey !== shift) return;
      onKeyDownRef.current(event);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, ctrl, shift, alt, meta]);
}
