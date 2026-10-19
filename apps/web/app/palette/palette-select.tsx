"use client";

import { useEffect } from "react";
import { PaletteIcon } from "lucide-react";

import { usePersistentState } from "@forthtilliath/react-kit/usePersistentState";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/dropdown-menu";

import {
  DEFAULT_PALETTE,
  type Palette,
  PALETTE_STORAGE_KEY,
  PALETTES,
  paletteSchema,
} from "./palettes";

/** Colour palette switcher, persisted in localStorage (see `palettes.ts`). */
export function PaletteSelect({ className }: { className?: string }) {
  const { value, setValue, hydrated } = usePersistentState<Palette>(
    PALETTE_STORAGE_KEY,
    DEFAULT_PALETTE,
    { schema: paletteSchema },
  );

  useEffect(() => {
    // Before hydration `value` is the default: it would override the palette
    // already applied by `paletteScript`.
    if (hydrated) document.documentElement.dataset.palette = value;
  }, [hydrated, value]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <PaletteIcon />
          <span className="sr-only">Change palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
        <DropdownMenuLabel>Palette</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            const parsed = paletteSchema.safeParse(next);
            if (parsed.success) setValue(parsed.data);
          }}
        >
          {PALETTES.map((palette) => (
            <DropdownMenuRadioItem
              key={palette}
              value={palette}
              className="capitalize"
            >
              {palette}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
