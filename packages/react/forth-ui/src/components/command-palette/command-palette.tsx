"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@forthtilliath/shadcn-ui/components/command";

import { type UiLocale, useUiMessages } from "../../locale/locale.js";

/** One command of a {@link CommandPalette}. */
export interface CommandPaletteItem {
  /** What the row shows. */
  label: React.ReactNode;
  /**
   * Unique value, also what the search filters on — include the words users may
   * type.
   */
  value: string;
  /** Icon shown before the label. */
  icon?: React.ReactNode;
  /**
   * Keyboard shortcut displayed at the end of the row, e.g. `"⌘P"` (display
   * only: binding it is up to the app).
   */
  shortcut?: string;
  /** Runs the command; the palette then closes. */
  onSelect: () => void;
}

/** A titled group of commands. */
export interface CommandPaletteGroup {
  /** Title of the group. */
  heading?: string;
  /** Its commands, in display order. */
  items: CommandPaletteItem[];
}

/** Props of {@link CommandPalette}. */
export interface CommandPaletteProps {
  /** The commands, by group. */
  groups: CommandPaletteGroup[];
  /**
   * Controlled open state; omit it to let the shortcut and Escape drive the
   * palette.
   */
  open?: boolean;
  /**
   * Called when the palette opens or closes (shortcut, Escape, command run).
   */
  onOpenChange?: (open: boolean) => void;
  /** Placeholder of the search field. Defaults to the locale's. */
  placeholder?: string;
  /** Shown when no command matches the search. Defaults to the locale's. */
  emptyMessage?: string;
  /** Key that toggles the palette alongside Cmd/Ctrl. @default "k" */
  shortcutKey?: string;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
}

/**
 * A global command menu (`Cmd/Ctrl+<key>` to open) — wraps shadcn-ui's own
 * `CommandDialog` (which has no keyboard-shortcut wiring of its own) with
 * that listener plus a flat `groups`/`items` API instead of hand-composing
 * `CommandGroup`/`CommandItem` every time.
 *
 * _Inspired from multiple sources, to make a consistent and reusable
 * component._
 * @see https://ui.shadcn.com/docs/components/command
 * @see https://www.hextaui.com/docs/ui/components/command-menu
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function CommandPalette({
  groups,
  open,
  onOpenChange,
  placeholder,
  emptyMessage,
  shortcutKey = "k",
  locale,
}: CommandPaletteProps) {
  const messages = useUiMessages(locale);
  const emptyMessageText = emptyMessage ?? messages.emptyResults;
  const placeholderText = placeholder ?? messages.commandPalette.placeholder;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isOpen = open ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps -- `setOpen` is a plain function redefined every render; including it would re-register this listener every render instead of only when `isOpen`/`shortcutKey` actually change, which is what its own re-closure over `isOpen` depends on
  }, [isOpen, shortcutKey]);

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setOpen}
      title="Command Palette"
      description={placeholderText}
    >
      <CommandInput placeholder={placeholderText} />
      <CommandList>
        <CommandEmpty>{emptyMessageText}</CommandEmpty>
        {groups.map((group, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- `heading` is optional and not guaranteed unique
          <CommandGroup key={group.heading ?? index} heading={group.heading}>
            {group.items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  item.onSelect();
                  setOpen(false);
                }}
              >
                {item.icon}
                {item.label}
                {item.shortcut !== undefined && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
