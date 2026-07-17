import type React from "react";

import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bento-grid"
      className={cn("grid auto-rows-[12rem] grid-cols-3 gap-4", className)}
      {...props}
    />
  );
}

export type BentoGridItemProps = React.ComponentProps<"div"> & {
  /** Columns (out of the grid's 3) this item spans. @default 1 */
  colSpan?: 1 | 2 | 3;
  /** Rows this item spans. @default 1 */
  rowSpan?: 1 | 2;
};

const COL_SPAN_CLASSES: Record<
  NonNullable<BentoGridItemProps["colSpan"]>,
  string
> = {
  1: "",
  2: "col-span-2",
  3: "col-span-3",
};

const ROW_SPAN_CLASSES: Record<
  NonNullable<BentoGridItemProps["rowSpan"]>,
  string
> = {
  1: "",
  2: "row-span-2",
};

/**
 * A CSS-grid layout for unevenly-sized cards ("bento box" layouts) — a
 * lightweight layout helper (`grid`+`col-span`/`row-span`), not a
 * dependency-driven masonry/packing algorithm.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.aceternity.com/components/bento-grid
 * @see https://blocks.mvp-subha.me/docs/grids/bento
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function BentoGridItem({
  colSpan = 1,
  rowSpan = 1,
  className,
  ...props
}: BentoGridItemProps) {
  return (
    <div
      data-slot="bento-grid-item"
      className={cn(
        "border-border rounded-xl border p-4",
        COL_SPAN_CLASSES[colSpan],
        ROW_SPAN_CLASSES[rowSpan],
        className,
      )}
      {...props}
    />
  );
}
