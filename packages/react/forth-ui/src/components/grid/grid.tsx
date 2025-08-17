import React, { ComponentProps, useState } from "react";

import { useKeyListener } from "@forthtilliath/react-hooks/useKeyListener";
import { type ClassValue, cn } from "@forthtilliath/shadcn-ui/lib/utils";
import { type Merge } from "@forthtilliath/types/object";

import { GridItem } from "./grid-item";
import { GridVariants, gridVariants } from "./variants";

type Props = Merge<
  {
    children?: React.ReactNode;
    debug?: boolean;
    debugKey?: string;
    className?: ClassValue;
  } & GridVariants
>;

export function Grid({
  children,
  className,
  debug,
  debugKey,
  cols,
  spacing,
  ...props
}: Props) {
  const [isDebugActive, setIsDebugActive] = useState(true);

  useKeyListener({ key: debugKey }, () => {
    setIsDebugActive((v) => !v);
  });

  return (
    <div
      className={cn(gridVariants({ cols, spacing }), className, {
        relative: debug,
      })}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === GridItem) {
          return React.cloneElement(child, {
            debug,
            isDebugActive,
          } as ComponentProps<typeof GridItem>);
        }
        if(debug) console.warn("Grid.Item must be used as first children of Grid to enable debug mode");
        return child;
      })}
    </div>
  );
}

Grid.Item = GridItem;
