"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface CheckboxGroupOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/**
 * A group of `Checkbox`es sharing a single array value — shadcn-ui's own
 * `Checkbox` is a standalone control with no grouped-value management, the
 * gap heroui's Checkbox Group fills.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/checkbox
 * @see https://www.heroui.com/docs/components/checkbox-group
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function CheckboxGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  orientation = "vertical",
  className,
}: CheckboxGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? [],
  );
  const selected = value ?? uncontrolledValue;

  function toggle(optionValue: string, checked: boolean) {
    const next = checked
      ? [...selected, optionValue]
      : selected.filter((v) => v !== optionValue);
    setUncontrolledValue(next);
    onValueChange?.(next);
  }

  return (
    <div
      role="group"
      data-slot="checkbox-group"
      className={cn(
        orientation === "horizontal" ? "flex flex-wrap gap-4" : "grid gap-3",
        className,
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-2 text-sm",
            (disabled || option.disabled) && "cursor-not-allowed opacity-50",
          )}
        >
          <Checkbox
            checked={selected.includes(option.value)}
            disabled={disabled || option.disabled}
            onCheckedChange={(checked) => {
              toggle(option.value, checked === true);
            }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
