"use client";

import * as React from "react";

export interface UseScrollspyOptions {
  /** Element `id`s to track, in document order. */
  ids: string[];
  /**
   * Passed to `IntersectionObserver`. The default treats a section as
   * active once it's within the top 20% of the viewport.
   * @default "0px 0px -80% 0px"
   */
  rootMargin?: string;
  /**
   * Tracks scroll position within this element instead of the whole page
   * (e.g. a scrollable docs pane) — passed through as the observer's
   * `root`.
   */
  root?: React.RefObject<HTMLElement | null>;
}

const DEFAULT_ROOT_MARGIN = "0px 0px -80% 0px";

/**
 * Tracks which of the given element `id`s is currently scrolled into
 * view, via `IntersectionObserver` — for highlighting the active link in
 * a table-of-contents/side nav as the page scrolls.
 *
 * @see https://ktui.io/docs/scrollspy
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function useScrollspy({
  ids,
  rootMargin = DEFAULT_ROOT_MARGIN,
  root,
}: UseScrollspyOptions): string | null {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible !== undefined) {
          setActiveId(visible.target.id);
        }
      },
      { root: root?.current, rootMargin },
    );

    for (const el of elements) {
      observer.observe(el);
    }
    return () => {
      observer.disconnect();
    };
  }, [ids, rootMargin, root]);

  return activeId;
}
