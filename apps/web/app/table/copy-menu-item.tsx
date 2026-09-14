"use client";

import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@forthtilliath/react-kit/useCopyToClipboard";
import { DropdownMenuItem } from "@forthtilliath/shadcn-ui/components/dropdown-menu";

export interface CopyMenuItemProps {
  /** Text copied to the clipboard on select. */
  value: string;
  children: React.ReactNode;
}

/**
 * A DropdownMenuItem that copies `value` to the clipboard on select and
 * shows a checkmark for a couple seconds instead of just closing silently —
 * `onSelect`'s default is prevented so the menu doesn't close before the
 * user sees the confirmation.
 */
export function CopyMenuItem({ value, children }: CopyMenuItemProps) {
  const [copiedText, copy] = useCopyToClipboard();
  const copied = copiedText === value;

  return (
    <DropdownMenuItem
      onSelect={(event) => {
        event.preventDefault();
        void copy(value);
      }}
    >
      {copied ? <Check /> : <Copy />}
      {children}
    </DropdownMenuItem>
  );
}
