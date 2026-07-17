"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/forth-ui/badge";

import type { ComboboxOption } from "./combobox";

export type MultiSelectOption = ComboboxOption;

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * `Combobox`'s multi-value sibling — selected options render as removable
 * `Badge` chips in the trigger. Fills the same shadcn-ui gap as `Combobox`
 * (no standalone primitive, just the `Popover`+`Command` recipe), and the
 * gap shadcn-extension's Multi Select fills specifically for multi-value
 * selection.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/combobox
 * @see https://shadcn-extension.vercel.app/docs/multi-select
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? [],
  );
  const selected = value ?? uncontrolledValue;

  function update(next: string[]) {
    setUncontrolledValue(next);
    onValueChange?.(next);
  }

  function toggle(optionValue: string) {
    update(
      selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue],
    );
  }

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/*
          A `<div>`, not `<button>`: each selected `Badge` renders its own
          real `<button>` for the dismiss icon, and a `<button>` cannot
          contain another `<button>` (invalid HTML, breaks hydration).
          `role="combobox"` + `tabIndex` + a manual Enter/Space handler
          keep it keyboard-accessible in place of native button semantics.
        */}
        <div
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-expanded={open}
          aria-disabled={disabled}
          data-disabled={disabled}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-auto min-h-9 w-full cursor-pointer justify-between font-normal data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            className,
          )}
        >
          <span className="flex flex-1 flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  dismissible
                  open
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onOpenChange={() => {
                    toggle(option.value);
                  }}
                >
                  {option.label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground font-normal">
                {placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDownIcon className="shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    toggle(option.value);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "size-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
