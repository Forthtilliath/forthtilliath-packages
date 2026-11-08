"use client";

import { type RefObject, useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]",
].join(",");

/**
 * Elements of `root` reachable with Tab, in DOM order. Elements with a
 * negative `tabindex` (e.g. inactive tabs of a roving-tabindex tab list) are
 * left out, as the browser skips them too.
 *
 * @param root - The container to search.
 * @returns The tabbable descendants of `root`.
 */
export function getTabbableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.tabIndex >= 0);
}

/** Options of {@link useFocusTrap}. */
export interface FocusTrapOptions {
  /** Focus the first tabbable element on activation (default `true`). */
  autoFocus?: boolean;
  /**
   * Give focus back to the element focused before activation, once the trap
   * is released (default `true`).
   */
  restoreFocus?: boolean;
}

/**
 * Keeps keyboard focus inside `ref`'s element while `active`: Tab on the last
 * tabbable element goes back to the first, Shift+Tab on the first goes to the
 * last, and focus that escaped the container is pulled back in. The building
 * block of an accessible modal or drawer, for a project without Radix.
 *
 * @param ref - The container (e.g. the `role="dialog"` element).
 * @param active - Whether the trap is on (e.g. the modal's `isOpen`).
 * @param options - See {@link FocusTrapOptions}.
 * @example
 * const dialogRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(dialogRef, isOpen);
 * return isOpen && <div ref={dialogRef} role="dialog" aria-modal="true">…</div>;
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  options: FocusTrapOptions = {},
): void {
  const { autoFocus = true, restoreFocus = true } = options;

  useEffect(() => {
    if (!active) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (autoFocus && ref.current) getTabbableElements(ref.current)[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      const root = ref.current;
      if (event.key !== "Tab" || !root) return;
      const tabbable = getTabbableElements(root);
      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }

      const current = document.activeElement;
      const outside = !root.contains(current);
      if (event.shiftKey && (outside || current === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || current === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus && previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [active, ref, autoFocus, restoreFocus]);
}
