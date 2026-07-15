import type React from "react";
import { useMemo, useState } from "react";

import { useKeyListener } from "@forthtilliath/react-hooks/useKeyListener";
import { type ClassValue, cn } from "@forthtilliath/shadcn-ui/lib/utils";
import { type Prettify } from "@forthtilliath/types/object";

import { GridDebugContext } from "./context";
import { GridItem } from "./grid-item";
import type { GridVariants } from "./variants";
import { gridVariants } from "./variants";

export type GridProps = Prettify<
  {
    children?: React.ReactNode;
    debug?: boolean;
    debugKey?: string;
    className?: ClassValue;
  } & GridVariants &
    Omit<React.HTMLAttributes<HTMLDivElement>, "className">
>;

export function Grid({
  children,
  className,
  debug,
  debugKey = "g",
  cols,
  spacing,
  ...props
}: GridProps) {
  const [isDebugActive, setIsDebugActive] = useState(true);
  const contextValue = useMemo(
    () => ({ debug, isDebugActive }),
    [debug, isDebugActive],
  );

  useKeyListener({ key: debugKey }, () => {
    if (debug) setIsDebugActive((v) => !v);
  });

  return (
    <div
      className={cn(gridVariants({ cols, spacing }), className, {
        relative: debug,
      })}
      {...props}
    >
      <GridDebugContext value={contextValue}>{children}</GridDebugContext>
    </div>
  );
}

Grid.Item = GridItem;
