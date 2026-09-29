"use client";

import type * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { useCopyToClipboard } from "@forthtilliath/react-kit/useCopyToClipboard";
import { DropdownMenuItem } from "@forthtilliath/shadcn-ui/components/dropdown-menu";

export type CopyMenuItemProps = Omit<
  React.ComponentProps<typeof DropdownMenuItem>,
  "children"
> & {
  /** Text copied to the clipboard on select. */
  value: string;
  children: React.ReactNode;
};

/**
 * A `DropdownMenuItem` that copies `value` to the clipboard on select and
 * shows a checkmark for a couple of seconds — the menu stays open (its
 * `onSelect` default is prevented) so the user sees the confirmation.
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function CopyMenuItem({
  value,
  children,
  onSelect,
  ...props
}: CopyMenuItemProps) {
  const [copiedText, copy] = useCopyToClipboard();
  const copied = copiedText === value;

  return (
    <DropdownMenuItem
      {...props}
      onSelect={(event) => {
        event.preventDefault();
        void copy(value);
        onSelect?.(event);
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {children}
    </DropdownMenuItem>
  );
}
