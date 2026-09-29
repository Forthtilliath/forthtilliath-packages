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
} from "@/components/ui/command";

import {
  type UiLocale,
  useUiMessages,
} from "@/components/forth-ui/locale/locale";

export interface CommandPaletteItem {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteGroup {
  heading?: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  groups: CommandPaletteGroup[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
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
 * _Inspired from multiple sources, to make a consistent and reusable component._
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
