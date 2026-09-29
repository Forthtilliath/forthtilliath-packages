"use client";

import * as React from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { type UiLocale, useUiMessages } from "../../locale/locale.js";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
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
  locale,
}: RatingProps) {
  const messages = useUiMessages(locale);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const current = value ?? uncontrolledValue;
  const displayValue = hoverValue ?? current;

  function commit(next: number) {
    setUncontrolledValue(next);
    onValueChange?.(next);
  }

  // WAI-ARIA radio group: arrows move (and select) between stars, Home/End
  // jump to the first/last one.
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const target = {
      ArrowRight: current + 1,
      ArrowUp: current + 1,
      ArrowLeft: current - 1,
      ArrowDown: current - 1,
      Home: 1,
      End: max,
    }[e.key];
    if (target === undefined || readOnly) return;
    e.preventDefault();
    const next = Math.min(max, Math.max(1, target));
    commit(next);
    const stars = e.currentTarget.parentElement?.querySelectorAll("button");
    stars?.[next - 1]?.focus();
  }

  return (
    <div
      role="radiogroup"
      // Not a Tab stop itself — focus lives on the roving `role="radio"`
      // children below — but jsx-a11y wants an interactive-role element with
      // a mouse handler (onMouseLeave, used only to clear the hover preview)
      // to declare an explicit tabIndex.
      tabIndex={-1}
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
          aria-label={messages.rating.stars(starValue)}
          disabled={disabled}
          tabIndex={
            !readOnly && starValue === (current >= 1 ? current : 1) ? 0 : -1
          }
          onKeyDown={handleKeyDown}
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
