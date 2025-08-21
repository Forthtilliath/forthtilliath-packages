import React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";
import type { Merge } from "@forthtilliath/types/object";

import { useGridDebugContext } from "./context";
import {
  gridItemDebugVariants,
  type GridItemVariants,
  gridItemVariants,
} from "./variants";

type Props = Merge<
  GridItemVariants &
    React.ComponentProps<"div"> & {
      children: React.ReactNode;
    }
>;

/**
 * A GridItem is a component that represents an item inside a Grid.
 *
 * It receives the same props as a div and extends them with the GridItemVariants.
 */
export function GridItem({
  children,
  className,
  ...props
}: Props): React.JSX.Element {
  const { debug, isDebugActive } = useGridDebugContext();
  return (
    <div
      className={cn(gridItemVariants({ debug }), className)}
      data-slot="grid-item"
      {...props}
    >
      {children}

      {debug && (
        <div
          className={cn(gridItemDebugVariants({ active: isDebugActive }))}
          data-slot="grid-item-debug"
        />
      )}
    </div>
  );
}
