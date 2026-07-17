"use client";

import * as React from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<RatingProps["size"]>, string> = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
};

/**
 * A star rating control with keyboard navigation (each star is a `radio`
 * in a `radiogroup`) and hover preview.
 *
 * @see https://www.kibo-ui.com/components/rating
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  disabled = false,
  readOnly = false,
  size = "default",
  className,
}: RatingProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const current = value ?? uncontrolledValue;
  const displayValue = hoverValue ?? current;

  function commit(next: number) {
    setUncontrolledValue(next);
    onValueChange?.(next);
  }

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled}
      data-slot="rating"
      className={cn(
        "inline-flex items-center gap-0.5",
        (disabled || readOnly) && "pointer-events-none",
        className,
      )}
      onMouseLeave={() => {
        setHoverValue(null);
      }}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((starValue) => (
        <button
          key={starValue}
          type="button"
          role="radio"
          aria-checked={current === starValue}
          aria-label={`${starValue.toString()} star${starValue > 1 ? "s" : ""}`}
          disabled={disabled}
          tabIndex={readOnly ? -1 : 0}
          onMouseEnter={() => {
            setHoverValue(starValue);
          }}
          onClick={() => {
            if (!readOnly) {
              commit(starValue);
            }
          }}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          <StarIcon
            className={cn(
              SIZE_CLASSES[size],
              "transition-colors",
              starValue <= displayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
}
