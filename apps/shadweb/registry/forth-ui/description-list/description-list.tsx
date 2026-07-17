import type React from "react";

import { cn } from "@/lib/utils";

/**
 * A description list, with terms and descriptions.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui-x.junwen-k.dev/docs/components/description-list
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function DescriptionList({
  className,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="description-list"
      className={cn("divide-border divide-y", className)}
      {...props}
    />
  );
}

export function DescriptionGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="description-group"
      className={cn(
        "flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4",
        className,
      )}
      {...props}
    />
  );
}

export function DescriptionTerm({
  className,
  ...props
}: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="description-term"
      className={cn(
        "text-muted-foreground text-sm font-medium sm:w-1/3 sm:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function DescriptionDetail({
  className,
  ...props
}: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="description-detail"
      className={cn("text-sm sm:flex-1", className)}
      {...props}
    />
  );
}
