import type React from "react";

import { cn } from "@/lib/utils";

export type ButtonGroupProps = React.ComponentProps<"div"> & {
  /**
   * Stack the buttons vertically instead of horizontally.
   * @default false
   */
  vertical?: boolean;
};

/**
 * Groups buttons into a single, visually connected row (or column), joining
 * their borders and radii — for segmented controls / toolbars.
 *
 * @see https://ui.shadcn.com/docs/components/button#button-group
 */
export function ButtonGroup({
  className,
  vertical = false,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(
        "flex w-fit",
        vertical
          ? "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none"
          : "flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        "[&>*]:relative [&>*]:focus-visible:z-10",
        className,
      )}
      {...props}
    />
  );
}
