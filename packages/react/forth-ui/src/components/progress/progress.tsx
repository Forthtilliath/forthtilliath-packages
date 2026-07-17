import type React from "react";

import { Progress as ProgressPrimitive } from "@forthtilliath/shadcn-ui/components/progress";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { ProgressVariants } from "./variants";
import { progressVariants } from "./variants";

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive> &
  ProgressVariants & {
    /** A label rendered above the bar, on the left. */
    label?: React.ReactNode;
    /**
     * Shows the numeric `value` (rounded, with a `%` suffix) above the bar,
     * on the right.
     */
    showValue?: boolean;
  };

/**
 * Displays an indicator showing the completion progress of a task.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/progress
 * @see https://ktui.io/docs/progress
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Progress({
  className,
  variant,
  size,
  label,
  showValue = false,
  value,
  ...props
}: ProgressProps) {
  const bar = (
    <ProgressPrimitive
      className={cn(progressVariants({ variant, size }), className)}
      value={value}
      {...props}
    />
  );

  const hasLabel = label !== undefined && label !== null;

  if (!hasLabel && !showValue) {
    return bar;
  }

  return (
    <div className="w-full space-y-1.5">
      {(hasLabel || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {hasLabel && <span>{label}</span>}
          {showValue && (
            <span className="text-muted-foreground tabular-nums">
              {Math.round(value ?? 0)}%
            </span>
          )}
        </div>
      )}
      {bar}
    </div>
  );
}
