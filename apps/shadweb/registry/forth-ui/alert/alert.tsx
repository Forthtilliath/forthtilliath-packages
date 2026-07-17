"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { AlertVariants } from "./variants";
import { alertVariants } from "./variants";

export type AlertProps = React.ComponentProps<"div"> &
  AlertVariants & {
    /**
     * Shows a close button. Uncontrolled by default (the alert hides itself
     * once dismissed) — pass `open`/`onOpenChange` to control it instead.
     */
    dismissible?: boolean;
    /**
     * Controlled visibility. Omit for uncontrolled (self-managed via
     * `dismissible`'s internal state).
     */
    open?: boolean;
    /**
     * Called when the alert is dismissed, whether controlled or not.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Extra action content (e.g. a button) rendered top-right, before the
     * close button when `dismissible` is also set.
     */
    action?: React.ReactNode;
  };

/**
 * Displays a callout for user attention.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/alert
 * @see https://ktui.io/docs/alert
 * @see https://ktui.io/docs/dismiss
 * @see https://www.shadcnui-blocks.com/components/alert
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Alert({
  className,
  variant,
  look,
  size,
  dismissible = false,
  open,
  onOpenChange,
  action,
  children,
  ...props
}: AlertProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(true);
  const isOpen = open ?? uncontrolledOpen;
  const hasActions = Boolean(action) || dismissible;

  function handleDismiss() {
    setUncontrolledOpen(false);
    onOpenChange?.(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant, look, size }),
        hasActions && "pr-10",
        className,
      )}
      {...props}
    >
      {children}
      {hasActions && (
        <div
          data-slot="alert-actions"
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5"
        >
          {action}
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="rounded-sm opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
