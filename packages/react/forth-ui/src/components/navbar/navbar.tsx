"use client";

import * as React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export type NavbarProps = React.ComponentProps<"header"> & {
  /**
   * Scroll distance (px) past which the "scrolled" styling (border,
   * blurred background, shrunk width) kicks in.
   * @default 20
   */
  shrinkOffset?: number;
};

const DEFAULT_SHRINK_OFFSET = 20;

/**
 * A fixed, floating page header that visually shrinks and gains a
 * background/border once the page scrolls — style the `data-scrolled`
 * attribute to customize the transition (a default is provided).
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/navigation-menu
 * @see https://ui.aceternity.com/components/resizable-navbar
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Navbar({
  shrinkOffset = DEFAULT_SHRINK_OFFSET,
  className,
  children,
  ...props
}: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- initial synchronous read of the external scroll position, unavoidable for a subscription with no server-renderable equivalent
      setScrolled(window.scrollY > shrinkOffset);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [shrinkOffset]);

  return (
    <header
      data-slot="navbar"
      data-scrolled={scrolled}
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-full border border-transparent px-4 py-2 transition-all duration-300",
        "data-[scrolled=true]:bg-background/80 data-[scrolled=true]:border-border data-[scrolled=true]:max-w-3xl data-[scrolled=true]:shadow-md data-[scrolled=true]:backdrop-blur-md",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}
