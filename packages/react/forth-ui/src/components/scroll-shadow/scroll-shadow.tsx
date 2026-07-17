"use client";

import * as React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export type ScrollShadowProps = React.ComponentProps<"div"> & {
  /** Size of the fade gradient, in pixels. @default 40 */
  shadowSize?: number;
};

/**
 * A vertically-scrollable container with fade-out gradient shadows at the
 * top/bottom edges, hidden once scrolled all the way to that edge — built
 * as a plain native-scroll `<div>` rather than wrapping shadcn-ui's
 * `ScrollArea`, since that component doesn't forward a ref to its inner
 * viewport (needed here to track scroll position for the fade toggling).
 *
 * @see https://www.heroui.com/docs/components/scroll-shadow
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ScrollShadow({
  className,
  shadowSize = 40,
  onScroll,
  ...props
}: ScrollShadowProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = React.useState(true);
  const [atBottom, setAtBottom] = React.useState(false);

  function updateEdges(el: HTMLDivElement) {
    // Also called from the onScroll handler below (a normal event, not an
    // effect) — these two disables only cover the mount-time effect call,
    // reading the element's scroll geometry that isn't known until after
    // the first paint.
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    setAtTop(el.scrollTop <= 0);
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  }

  React.useEffect(() => {
    if (ref.current !== null) {
      updateEdges(ref.current);
    }
  }, []);

  const maskFrom = atTop ? "black" : "transparent";
  const maskTo = atBottom ? "black" : "transparent";
  const mask = `linear-gradient(to bottom, ${maskFrom}, black ${shadowSize.toString()}px, black calc(100% - ${shadowSize.toString()}px), ${maskTo})`;

  return (
    <div
      ref={ref}
      data-slot="scroll-shadow"
      data-at-top={atTop}
      data-at-bottom={atBottom}
      onScroll={(e) => {
        updateEdges(e.currentTarget);
        onScroll?.(e);
      }}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={cn("overflow-y-auto", className)}
      {...props}
    />
  );
}
