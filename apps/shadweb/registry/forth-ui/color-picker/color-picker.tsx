"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

/**
 * A color swatch + hex text input, kept in sync — built on the browser's
 * own native `<input type="color">` (a full saturation/hue picker in every
 * modern browser) rather than adding a color-picker library, since the
 * reference sources (hextaui, kibo-ui) don't offer anything the native
 * picker doesn't already provide for a single hex value.
 *
 * @see https://www.hextaui.com/docs/ui/components/color-picker
 * @see https://www.kibo-ui.com/components/color-picker
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ColorPicker({
  value,
  defaultValue = "#000000",
  onValueChange,
  disabled = false,
  className,
}: ColorPickerProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const [textValue, setTextValue] = React.useState(defaultValue);
  const color = value ?? uncontrolledValue;

  function commit(next: string) {
    setUncontrolledValue(next);
    setTextValue(next);
    onValueChange?.(next);
  }

  return (
    <div
      data-slot="color-picker"
      className={cn("flex items-center gap-2", className)}
    >
      <label
        className={cn(
          "border-input size-9 shrink-0 overflow-hidden rounded-md border shadow-xs",
          disabled && "pointer-events-none opacity-50",
        )}
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          value={color}
          disabled={disabled}
          onChange={(e) => {
            commit(e.target.value);
          }}
          className="size-full cursor-pointer opacity-0"
        />
      </label>
      <Input
        value={textValue}
        disabled={disabled}
        onChange={(e) => {
          setTextValue(e.target.value);
          if (HEX_PATTERN.test(e.target.value)) {
            commit(e.target.value);
          }
        }}
        onBlur={() => {
          setTextValue(color);
        }}
        className="w-28 font-mono uppercase"
        maxLength={7}
      />
    </div>
  );
}
