"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export interface ReparentTarget {
  /**
   * A CSS media query (e.g. `"(min-width: 640px)"`). Checked in array
   * order — the first match wins. Omit on one entry (typically the last)
   * to use it as the fallback when nothing else matches.
   */
  query?: string;
  /** Where `children` gets portaled into when this entry is active. */
  container: React.RefObject<HTMLElement | null>;
}

export interface ReparentProps {
  children: React.ReactNode;
  targets: ReparentTarget[];
}

/**
 * Moves `children` between different container elements at different
 * screen sizes — e.g. a search box that lives in a mobile menu on small
 * screens and in the header on larger ones — without unmounting it (so its
 * internal state survives the move), via a `createPortal` whose target
 * swaps based on `matchMedia`.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ktui.io/docs/reparent
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Reparent({ children, targets }: ReparentProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const queries = targets
      .map((target) => (target.query ? window.matchMedia(target.query) : null))
      .filter((mql): mql is MediaQueryList => mql !== null);

    function evaluate() {
      const index = targets.findIndex(
        (target) => !target.query || window.matchMedia(target.query).matches,
      );
      // Determines which target is active right now — there's no way to
      // know this from render alone (matchMedia is a browser-only API), so
      // the first evaluation has to happen synchronously here, not just on
      // subsequent "change" events.
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      setActiveIndex(index === -1 ? null : index);
    }

    evaluate();
    queries.forEach((mql) => {
      mql.addEventListener("change", evaluate);
    });
    return () => {
      queries.forEach((mql) => {
        mql.removeEventListener("change", evaluate);
      });
    };
  }, [targets]);

  if (activeIndex === null) {
    return null;
  }

  const container = targets[activeIndex]?.container.current;
  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
