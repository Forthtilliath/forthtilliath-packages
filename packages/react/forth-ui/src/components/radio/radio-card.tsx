"use client";

import type * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CheckIcon } from "lucide-react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export type RadioCardProps = React.ComponentProps<
  typeof RadioGroupPrimitive.Item
> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
};

/**
 * A card-style `RadioGroup` item — the whole card is the clickable target,
 * showing label/description/an optional icon plus a checkmark once
 * selected. shadcn-ui's own `RadioGroupItem` only renders the small circle
 * (its `children` prop is discarded in favor of a hardcoded indicator), so
 * this is built directly on the Radix primitive instead. Use it in place
 * of `RadioGroupItem` inside the same shadcn-ui `RadioGroup`.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/radio-group
 * @see https://www.kibo-ui.com/components/choicebox
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function RadioCard({
  label,
  description,
  icon,
  className,
  ...props
}: RadioCardProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      className={cn(
        "border-input hover:bg-accent/50 focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:ring-primary/20 relative flex items-start gap-3 rounded-lg border p-4 text-left shadow-xs transition-colors outline-none focus-visible:ring-[3px] data-[state=checked]:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {icon}
      <div className="grid gap-1">
        <span className="text-sm leading-none font-medium">{label}</span>
        {description !== undefined && (
          <span className="text-muted-foreground text-sm">{description}</span>
        )}
      </div>
      <RadioGroupPrimitive.Indicator className="absolute top-3 right-3">
        <CheckIcon className="text-primary size-4" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
