"use client";

import { useEffect } from "react";

/**
 * Blocks page scrolling while `active` (behind a modal or a drawer), and
 * restores the previous styles afterwards. The scrollbar that disappears is
 * replaced by an equal `padding-right`, so the page does not shift sideways.
 *
 * Nested locks (a modal opened from a modal) are fine as long as they are
 * released in reverse order, which React does when the inner one unmounts
 * first.
 *
 * @param active - Whether scrolling is blocked (e.g. the modal's `isOpen`).
 * @example
 * useScrollLock(isOpen);
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const { overflow, paddingRight } = root.style;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const current = Number.parseFloat(getComputedStyle(root).paddingRight);
      root.style.paddingRight = `${(current || 0) + scrollbarWidth}px`;
    }

    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
    };
  }, [active]);
}
