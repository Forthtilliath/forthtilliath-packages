"use client";

import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Button } from "@/components/forth-ui/button";

export type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

/**
 * A numeric input with increment/decrement stepper buttons, clamped to
 * `min`/`max`.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.heroui.com/docs/components/number-input
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function NumberInput({
  className,
  value,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled = false,
  ...props
}: NumberInputProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const current = value ?? uncontrolledValue;

  function commit(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    setUncontrolledValue(clamped);
    onValueChange?.(clamped);
  }

  return (
    <div
      data-slot="number-input"
      className={cn("flex w-fit items-stretch", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || current <= min}
        onClick={() => {
          commit(current - step);
        }}
        aria-label="Decrement"
        className="rounded-r-none"
      >
        <MinusIcon />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        value={current}
        min={min === -Infinity ? undefined : min}
        max={max === Infinity ? undefined : max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (!Number.isNaN(parsed)) {
            commit(parsed);
          }
        }}
        className="w-16 rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || current >= max}
        onClick={() => {
          commit(current + step);
        }}
        aria-label="Increment"
        className="rounded-l-none"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
