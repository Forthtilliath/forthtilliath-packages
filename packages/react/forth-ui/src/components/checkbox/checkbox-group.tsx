"use client";

import * as React from "react";

import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

/** One checkbox of a {@link CheckboxGroup}. */
export interface CheckboxGroupOption {
  /** Label next to the checkbox (clicking it toggles the box). */
  label: React.ReactNode;
  /** Unique value, added to or removed from the group's array. */
  value: string;
  /** Disables this checkbox only. */
  disabled?: boolean;
}

/** Props of {@link CheckboxGroup}. */
export interface CheckboxGroupProps {
  /** The checkboxes, in display order. */
  options: CheckboxGroupOption[];
  /** Controlled checked values. */
  value?: string[];
  /** Initially checked values when uncontrolled. */
  defaultValue?: string[];
  /** Called with every checked value after each toggle. */
  onValueChange?: (value: string[]) => void;
  /** Disables every checkbox. */
  disabled?: boolean;
  /** `vertical` (one per line, the default) or `horizontal` (wrapping row). */
  orientation?: "vertical" | "horizontal";
  /** Classes of the group container. */
  className?: string;
}

/**
 * A group of `Checkbox`es sharing a single array value — shadcn-ui's own
 * `Checkbox` is a standalone control with no grouped-value management, the
 * gap heroui's Checkbox Group fills.
 *
 * _Inspired from multiple sources, to make a consistent and reusable
 * component._
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
