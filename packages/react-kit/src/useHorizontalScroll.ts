"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
 * `onScroll`.
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<TInner>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      scrollRef.current?.scrollBy({
        left: direction * step,
        behavior: "smooth",
      });
    },
    [step],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // ResizeObserver fires once on initial observation, so no manual update
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [updateScrollState]);

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
    scrollRef,
    innerRef,
    canScrollLeft,
    canScrollRight,
    updateScrollState,
    scrollByStep,
  };
}
