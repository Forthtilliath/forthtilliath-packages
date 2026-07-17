"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { BannerVariants } from "./variants";
import { bannerVariants } from "./variants";

export type BannerProps = React.ComponentProps<"div"> &
  BannerVariants & {
    /**
     * Shows a close button. Uncontrolled by default (the banner hides
     * itself once dismissed) — pass `open`/`onOpenChange` to control it
     * instead.
     */
    dismissible?: boolean;
    /**
     * Controlled visibility. Omit for uncontrolled (self-managed via
     * `dismissible`'s internal state).
     */
    open?: boolean;
    /**
     * Called when the banner is dismissed, whether controlled or not.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Extra action content (e.g. a link or button) rendered after the
     * message, before the close button when `dismissible` is also set.
     */
    action?: React.ReactNode;
    /**
     * Hides the banner once the page has scrolled past ~40px. Only
     * meaningful when `sticky` is also set.
     */
    hideOnScroll?: boolean;
  };

const HIDE_ON_SCROLL_THRESHOLD = 40;

/**
 * A full-width, page-level announcement bar — as opposed to `Alert`, which
 * is an inline callout within page content.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/banner
 * @see https://ui.aceternity.com/components/sticky-banner
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Banner({
  className,
  variant,
  look,
  inset,
  sticky,
  dismissible = false,
  open,
  onOpenChange,
  hideOnScroll = false,
  action,
  children,
  ...props
}: BannerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(true);
  const [scrolledPast, setScrolledPast] = React.useState(false);
  const isOpen = (open ?? uncontrolledOpen) && !scrolledPast;

  React.useEffect(() => {
    if (!hideOnScroll) {
      return;
    }
    function onScroll() {
      setScrolledPast(window.scrollY > HIDE_ON_SCROLL_THRESHOLD);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hideOnScroll]);

  function handleDismiss() {
    setUncontrolledOpen(false);
    onOpenChange?.(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-slot="banner"
      role="region"
      className={cn(
        bannerVariants({ variant, look, inset, sticky }),
        className,
      )}
      {...props}
    >
      {children}
      {action}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="ml-1 shrink-0 rounded-sm opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
