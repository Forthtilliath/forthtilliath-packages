"use client";

import * as React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface ScrollProgressProps {
  className?: string;
  /** Tracks this element's own scroll instead of the window's. */
  target?: React.RefObject<HTMLElement | null>;
}

/**
 * A fixed bar at the top of the page (or a scrollable container) that
 * fills as the user scrolls through it.
 *
 * @see https://bundui.io/components/scroll-progress-bar
 * @see https://motion-primitives.com/docs/scroll-progress
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ScrollProgress({ className, target }: ScrollProgressProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = target?.current;

    function onScroll() {
      const scrollTop = el ? el.scrollTop : window.scrollY;
      const scrollHeight = el
        ? el.scrollHeight - el.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- also called from a real scroll event listener, not just the effect below; this disable only covers the mount-time initial read of the current scroll position
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }

    const node = el ?? window;
    node.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      node.removeEventListener("scroll", onScroll);
    };
  }, [target]);

  return (
    <div
      data-slot="scroll-progress"
      className={cn(
        "bg-primary fixed inset-x-0 top-0 z-50 h-1 origin-left",
        className,
      )}
      style={{ transform: `scaleX(${(progress / 100).toString()})` }}
    />
  );
}
