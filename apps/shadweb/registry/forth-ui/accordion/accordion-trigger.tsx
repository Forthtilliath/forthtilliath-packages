"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { LucideProps } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type AccordionTriggerProps = React.ComponentProps<
  typeof AccordionPrimitive.Trigger
> & {
  hideChevron?: boolean;
  customChevron?: React.ReactElement<LucideProps>;
};

/**
 * shadcn-ui's `AccordionTrigger` markup, plus `hideChevron` / `customChevron`
 * — built here on the Radix primitive rather than relying on a customized
 * shadcn copy, so forth-ui also works with the upstream shadcn `accordion`
 * (e.g. installed through the registry).
 */
export function AccordionTrigger({
  className,
  hideChevron = false,
  customChevron,
  children,
  ...props
}: AccordionTriggerProps) {
  const chevronClassName = cn(
    "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
    customChevron?.props.className,
  );

  let chevron: React.ReactNode = null;
  if (!hideChevron) {
    chevron = customChevron ? (
      // cloneElement (not `Slot`) so the merged className goes through
      // `cn()`'s tailwind-merge dedup, and the icon stays the trigger's
      // direct child for the `>svg` selector below.
      // eslint-disable-next-line @eslint-react/no-clone-element
      React.cloneElement(customChevron, { className: chevronClassName })
    ) : (
      <ChevronDownIcon className={chevronClassName} />
    );
  }

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        {chevron}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
