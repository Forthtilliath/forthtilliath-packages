"use client";

import type React from "react";
import { useMemo, useState } from "react";
import type { ClassValue } from "clsx";

import { useKeyListener } from "@forthtilliath/react-kit/useKeyListener";
import { cn } from "@/lib/utils";
import { type Prettify } from "@forthtilliath/ts-types/object";

import { GridDebugContext } from "./context";
import { GridItem } from "./grid-item";
import type { GridVariants } from "./variants";
import { gridVariants } from "./variants";

/**
 * Props of {@link Grid}: the {@link GridVariants} (`cols`, `spacing`), `debug`,
 * and any `<div>` attribute.
 */
export type GridProps = Prettify<
  {
    children?: React.ReactNode;
    debug?: boolean;
    debugKey?: string;
    className?: ClassValue;
  } & GridVariants &
    Omit<React.HTMLAttributes<HTMLDivElement>, "className">
>;

/**
 * A CSS grid layout (`cols` from 1 to 12, `spacing` from `none` to `xl`) for
 * `GridItem`s. With `debug`, each item shows an outline of its cell, toggled
 * with the `debugKey` key — handy while laying out a page, never in production.
 * @param props - See {@link GridProps}.
 * @example
 * <Grid cols={3} spacing="lg">
 *   <GridItem>A</GridItem>
 *   <GridItem cols="2">B</GridItem>
 * </Grid>
 */
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
