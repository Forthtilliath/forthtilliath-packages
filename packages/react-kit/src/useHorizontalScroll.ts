"use client";

import { useCallback, useEffect, useState } from "react";

export interface UseHorizontalScrollOptions {
  /** Distance in px scrolled by `scrollByStep`. Defaults to `240`. */
  step?: number;
  /**
   * Scroll with the left/right arrow keys, unless focus is in a form field.
   * Defaults to `true`.
   */
  keyboard?: boolean;
}

function isEditable(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "SELECT" ||
    el.tagName === "TEXTAREA" ||
    el.isContentEditable
  );
}

/**
 * Tracks whether a horizontally scrollable container can scroll further left
 * or right (for edge shadows or arrow buttons), kept in sync on resize of the
 * container or its content. Attach `scrollRef` to the scrolling element,
 * `innerRef` to its (wider) content, and call `updateScrollState` from its
 * `onScroll`. Both are callback refs, so elements rendered conditionally
 * (after the first render) are tracked too.
 *
 * @example
 * const { scrollRef, innerRef, canScrollLeft, canScrollRight, updateScrollState, scrollByStep } =
 *   useHorizontalScroll<HTMLTableElement>();
 * return (
 *   <div ref={scrollRef} onScroll={updateScrollState} className="overflow-x-auto">
 *     <table ref={innerRef}>…</table>
 *   </div>
 * );
 */
export function useHorizontalScroll<TInner extends HTMLElement = HTMLElement>(
  options: UseHorizontalScrollOptions = {},
) {
  const { step = 240, keyboard = true } = options;
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [innerEl, setInnerEl] = useState<TInner | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!scrollEl) return;
    setCanScrollLeft(scrollEl.scrollLeft > 0);
    setCanScrollRight(
      scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 1,
    );
  }, [scrollEl]);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      scrollEl?.scrollBy({
        left: direction * step,
        behavior: "smooth",
      });
    },
    [scrollEl, step],
  );

  useEffect(() => {
    if (!scrollEl || typeof ResizeObserver === "undefined") return;
    // ResizeObserver fires once on initial observation, so no manual update
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(scrollEl);
    if (innerEl) observer.observe(innerEl);
    return () => {
      observer.disconnect();
    };
  }, [scrollEl, innerEl, updateScrollState]);

  useEffect(() => {
    if (!keyboard) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditable(document.activeElement)) return;
      if (event.key === "ArrowLeft") scrollByStep(-1);
      if (event.key === "ArrowRight") scrollByStep(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboard, scrollByStep]);

  return {
    scrollRef: setScrollEl,
    innerRef: setInnerEl,
    canScrollLeft,
    canScrollRight,
    updateScrollState,
    scrollByStep,
  };
}
