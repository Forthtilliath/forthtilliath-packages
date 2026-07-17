"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@forthtilliath/shadcn-ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@forthtilliath/shadcn-ui/components/popover";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { Button } from "../button";

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Passed through to `Date.prototype.toLocaleDateString`. */
  formatOptions?: Intl.DateTimeFormatOptions;
}

const DEFAULT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "long",
};

/**
 * A single-date picker — shadcn-ui's own docs describe this as a recipe
 * (`Popover` + `Calendar`) rather than shipping a standalone primitive,
 * one every consumer reassembles by hand. Wraps that recipe into a
 * `value`/`onValueChange` component.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/date-picker
 * @see https://www.hextaui.com/docs/ui/components/date-picker
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  formatOptions = DEFAULT_FORMAT_OPTIONS,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const selected = value ?? uncontrolledValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            selected === undefined && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon />
          {selected !== undefined
            ? selected.toLocaleDateString(undefined, formatOptions)
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            setUncontrolledValue(date);
            onValueChange?.(date);
            setOpen(false);
          }}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
