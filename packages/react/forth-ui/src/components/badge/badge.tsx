"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge as BadgePrimitive } from "@forthtilliath/shadcn-ui/components/badge";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { BadgeVariants } from "./variants";
import { badgeVariants, dotVariants } from "./variants";

export type BadgeProps = Omit<
  React.ComponentProps<typeof BadgePrimitive>,
  "variant"
> &
  BadgeVariants & {
    /**
     * Show a small colored dot before the content instead of filling the
     * whole badge — pairs best with `look="soft"` or `"outline"`, where the
     * dot itself carries the color signal.
     */
    dot?: boolean;
    /**
     * Adds an animated ping ring around the `dot`, for a live/status
     * indicator. Ignored without `dot`.
     */
    pulse?: boolean;
    /**
     * Shows a close button. Uncontrolled by default (the badge hides itself
     * once dismissed) — pass `open`/`onOpenChange` to control it instead.
     *
     * Not meant to be combined with `asChild`: `Slot` requires a single
     * child, and the close button renders as an extra sibling.
     */
    dismissible?: boolean;
    /**
     * Controlled visibility. Omit for uncontrolled (self-managed via
     * `dismissible`'s internal state).
     */
    open?: boolean;
    /**
     * Called when the badge is dismissed, whether controlled or not.
     */
    onOpenChange?: (open: boolean) => void;
  };

/**
 * Displays a badge or a component that looks like a badge.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/badge
 * @see https://ktui.io/docs/badge
 * @see https://www.shadcnui-blocks.com/components/badge
 * @see https://www.kibo-ui.com/components/status
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Badge({
  className,
  variant,
  look,
  shape,
  size,
  dot = false,
  pulse = false,
  dismissible = false,
  open,
  onOpenChange,
  children,
  ...props
}: BadgeProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(true);
  const isOpen = open ?? uncontrolledOpen;

  function handleDismiss(event: React.MouseEvent) {
    event.stopPropagation();
    setUncontrolledOpen(false);
    onOpenChange?.(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <BadgePrimitive
      className={cn(badgeVariants({ variant, look, shape, size }), className)}
      {...props}
    >
      {dot && (
        <span className="relative inline-flex size-1.5">
          {pulse && (
            <span
              className={cn(
                dotVariants({ variant }),
                "absolute inline-flex size-full animate-ping opacity-75",
              )}
            />
          )}
          <span className={cn(dotVariants({ variant }), "relative")} />
        </span>
      )}
      {children}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="-mr-0.5 ml-0.5 rounded-full opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current [&>svg]:size-2.5"
        >
          <X />
        </button>
      )}
    </BadgePrimitive>
  );
}
