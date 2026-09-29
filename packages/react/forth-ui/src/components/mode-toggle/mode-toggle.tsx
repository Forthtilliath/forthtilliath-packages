"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/dropdown-menu";

import { type UiLocale, useUiMessages } from "../../locale/locale.js";

export interface ModeToggleProps {
  className?: string;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s.
   */
  locale?: UiLocale;
}

const THEMES = ["light", "dark", "system"] as const;

/**
 * A light / dark / system theme switcher — the web counterpart of
 * react-native-kit's `ThemeToggle`. Built on `next-themes`: render it under
 * a `ThemeProvider` (this folder's, or next-themes' own).
 *
 * @see https://ui.shadcn.com/docs/dark-mode/next
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ModeToggle({ className, locale }: ModeToggleProps) {
  const messages = useUiMessages(locale);
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{messages.modeToggle.toggle}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => {
              setTheme(theme);
            }}
          >
            {messages.modeToggle[theme]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
