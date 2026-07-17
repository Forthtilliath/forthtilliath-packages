"use client";

import * as React from "react";
import type { LucideProps } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible as CollapsiblePrimitive,
  CollapsibleContent as CollapsibleContentPrimitive,
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
} from "@forthtilliath/shadcn-ui/components/collapsible";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export type CollapsibleProps = React.ComponentProps<
  typeof CollapsiblePrimitive
>;

/**
 * An interactive component which expands/collapses a single panel — the
 * single-item primitive `Accordion` is built on top of. Reach for
 * `Accordion` instead when you have several mutually-exclusive sections.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/collapsible
 * @see https://ktui.io/docs/collapse
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Collapsible(props: CollapsibleProps) {
  return <CollapsiblePrimitive data-slot="collapsible" {...props} />;
}

export type CollapsibleTriggerProps = React.ComponentProps<
  typeof CollapsibleTriggerPrimitive
> & {
  /** Hides the chevron icon entirely. */
  hideChevron?: boolean;
  /** Renders this icon instead of the default chevron. */
  customChevron?: React.ReactElement<LucideProps>;
};

/**
 * A trigger with a chevron that rotates 180° when the panel is open —
 * shadcn-ui's own `CollapsibleTrigger` renders no icon at all, matching
 * `AccordionTrigger`'s `hideChevron`/`customChevron` API for consistency.
 */
export function CollapsibleTrigger({
  className,
  hideChevron = false,
  customChevron,
  children,
  ...props
}: CollapsibleTriggerProps) {
  const chevronProps = {
    ...customChevron?.props,
    className: cn(
      "text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200",
      customChevron?.props.className,
    ),
  };

  return (
    <CollapsibleTriggerPrimitive
      className={cn(
        "flex flex-1 items-center justify-between gap-4 text-left text-sm font-medium [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      {!hideChevron && React.isValidElement(customChevron) ? (
        // cloneElement is required here (not the `Slot` pattern) so the merged
        // className goes through `cn()`'s tailwind-merge dedup, and the icon
        // stays the trigger's direct child for the `>svg` CSS selector above.
        // eslint-disable-next-line @eslint-react/no-clone-element
        React.cloneElement(customChevron, chevronProps)
      ) : (
        <ChevronDownIcon {...chevronProps} />
      )}
    </CollapsibleTriggerPrimitive>
  );
}

export type CollapsibleContentProps = React.ComponentProps<
  typeof CollapsibleContentPrimitive
>;

/**
 * A height-animated content panel — shadcn-ui's own `CollapsibleContent`
 * has no animation at all (an instant show/hide via Radix's `data-state`).
 * Uses the `animate-collapsible-down`/`-up` keyframes `tw-animate-css`
 * already ships (mirroring `accordion-down`/`-up`, keyed to Radix
 * Collapsible's own `--radix-collapsible-content-height` variable) but
 * that nothing in this repo used yet.
 */
export function CollapsibleContent({
  className,
  ...props
}: CollapsibleContentProps) {
  return (
    <CollapsibleContentPrimitive
      className={cn(
        "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden text-sm",
        className,
      )}
      {...props}
    />
  );
}
