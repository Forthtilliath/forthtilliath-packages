"use client";

import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  type UiLocale,
  useUiMessages,
} from "@/components/forth-ui/locale/locale";
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
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
};

/** Number typed by the user, accepting a comma as decimal separator. */
function parseTyped(text: string): number {
  const normalized = text.trim().replace(",", ".");
  return normalized === "" ? Number.NaN : Number(normalized);
}

/** Drops float noise from stepping (0.4 + 0.01) at the step's precision. */
function roundToStep(value: number, step: number): number {
  const decimals = String(step).split(".")[1]?.length ?? 0;
  return Number(value.toFixed(decimals));
}

/**
 * A numeric input with increment/decrement stepper buttons, clamped to
 * `min`/`max`.
 *
 * Typing stays free: in-range values are reported as you type, and the value
 * is only clamped when the field loses focus or on Enter — so `600` can be
 * typed with `min={128}` without the first `6` jumping to `128`.
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
  locale,
  onBlur,
  onKeyDown,
  ...props
}: NumberInputProps) {
  const messages = useUiMessages(locale);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const current = value ?? uncontrolledValue;

  // Raw text while typing; resynced when the value changes from outside.
  const [text, setText] = React.useState(String(current));
  const [shownValue, setShownValue] = React.useState(current);
  if (current !== shownValue) {
    setShownValue(current);
    if (parseTyped(text) !== current) setText(String(current));
  }

  function commit(next: number) {
    const clamped = roundToStep(Math.min(max, Math.max(min, next)), step);
    setUncontrolledValue(clamped);
    setText(String(clamped));
    if (clamped !== current) onValueChange?.(clamped);
  }

  function commitText() {
    const parsed = parseTyped(text);
    if (Number.isFinite(parsed)) commit(parsed);
    else setText(String(current));
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
        aria-label={messages.numberInput.decrement}
        className="rounded-r-none"
      >
        <MinusIcon />
      </Button>
      <Input
        type="number"
        inputMode={Number.isInteger(step) ? "numeric" : "decimal"}
        value={text}
        min={min === -Infinity ? undefined : min}
        max={max === Infinity ? undefined : max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          setText(e.target.value);
          const parsed = parseTyped(e.target.value);
          if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
            setUncontrolledValue(parsed);
            onValueChange?.(parsed);
          }
        }}
        onBlur={(e) => {
          commitText();
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitText();
          onKeyDown?.(e);
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
        aria-label={messages.numberInput.increment}
        className="rounded-l-none"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
