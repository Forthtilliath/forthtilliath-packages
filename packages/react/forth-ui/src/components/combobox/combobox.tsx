"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@forthtilliath/shadcn-ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@forthtilliath/shadcn-ui/components/popover";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { type UiLocale, useUiMessages } from "../../locale/locale.js";
import { Button } from "../button/index.js";

/** One option of a {@link Combobox} or {@link MultiSelect}. */
export interface ComboboxOption {
  /**
   * Text shown in the list and in the trigger, also what the search filters on.
   */
  label: string;
  /** Unique value, reported by `onValueChange`. */
  value: string;
  /** Shown but not selectable. */
  disabled?: boolean;
}

/** Props of {@link Combobox}. */
export interface ComboboxProps {
  /** The choices, in display order. */
  options: ComboboxOption[];
  /** The selected value (`""` or `undefined` for none). */
  value?: string;
  /**
   * Called with the chosen value — or `""` when the selected option is chosen
   * again (deselection).
   */
  onValueChange?: (value: string) => void;
  /**
   * Trigger text while nothing is selected, and default accessible name.
   * Defaults to the locale's.
   */
  placeholder?: string;
  /** Shown when no option matches the search. Defaults to the locale's. */
  emptyMessage?: string;
  /** Disables the trigger. */
  disabled?: boolean;
  /** Classes of the trigger button. */
  className?: string;
  /** `id` of the trigger — set by `Field`, or for a `<label htmlFor>`. */
  id?: string;
  /**
   * Accessible name of the trigger (a combobox takes no name from its text).
   * Defaults to the placeholder, unless a `<label>` targets `id`.
   */
  ariaLabel?: string;
  /**
   * Ids of the elements describing the field (hint, error) — set by `Field`.
   */
  "aria-describedby"?: string;
  /** Marks the field as invalid — set by `Field` when it has an error. */
  "aria-invalid"?: boolean;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
}

/**
 * An autocomplete/searchable select — shadcn-ui doesn't ship a standalone
 * Combobox primitive, only a docs recipe combining `Popover` + `Command`
 * that every consumer re-assembles by hand. This wraps that recipe into a
 * `options`/`value`/`onValueChange`-driven component.
 *
 * _Inspired from multiple sources, to make a consistent and reusable
 * component._
 * @see https://ui.shadcn.com/docs/components/combobox
 * @see https://www.kibo-ui.com/components/combobox
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage,
  disabled = false,
  className,
  locale,
  id,
  ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: ComboboxProps) {
  const messages = useUiMessages(locale);
  const emptyMessageText = emptyMessage ?? messages.emptyResults;
  const placeholderText = placeholder ?? messages.combobox.placeholder;
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-label={
            ariaLabel ?? (id === undefined ? placeholderText : undefined)
          }
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", className)}
        >
          {selected?.label ?? placeholderText}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={ariaLabel ?? placeholderText}
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command>
          <CommandInput placeholder={placeholderText} />
          <CommandList>
            <CommandEmpty>{emptyMessageText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange?.(option.value === value ? "" : option.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "size-4",
                      option.value === value ? "opacity-100" : "opacity-0",
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
