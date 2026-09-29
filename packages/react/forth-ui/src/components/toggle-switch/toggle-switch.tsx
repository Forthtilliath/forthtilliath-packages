"use client";

import type React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { ToggleSwitchSizeVariants } from "./variants.js";
import {
  toggleSwitchThumbVariants,
  toggleSwitchTrackVariants,
} from "./variants.js";

export type ToggleSwitchProps = Omit<
  React.ComponentProps<"button">,
  "children" | "className" | "onChange" | "onClick" | "role" | "type" | "value"
> &
  ToggleSwitchSizeVariants & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    /** Visible text, also used as the accessible name. */
    label?: React.ReactNode;
    /** Secondary text under the label. */
    description?: React.ReactNode;
    /** Side of the text relative to the track (default: `"end"`). */
    labelPosition?: "start" | "end";
    /**
     * Custom classes for each part of the component.
     *
     * - `root` is the `<button role="switch">` element — a `group/toggle-switch`
     *   carrying `data-state="checked" | "unchecked"`, so any part can be
     *   styled per state (`group-data-[state=checked]/toggle-switch:...`).
     * - `track` / `thumb` are the switch itself.
     * - `text` wraps the label and description (only when a description is set).
     * - `label` / `description` are the text elements.
     */
    className?: Partial<
      Record<
        "root" | "track" | "thumb" | "text" | "label" | "description",
        string
      >
    >;
  };

/**
 * An on/off switch (`role="switch"`) with an optional visible label and
 * description — clicking the text toggles it too. Visually distinct from an
 * action button.
 *
 * Unlike shadcn's `Switch`, it has no Radix dependency and bundles the label,
 * so a whole settings row is a single, fully clickable element.
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ToggleSwitch({
  checked,
  onCheckedChange,
  label,
  description,
  labelPosition = "end",
  size,
  className,
  ...props
}: ToggleSwitchProps) {
  const labelNode =
    label === undefined ? null : (
      <span className={cn("text-foreground text-sm", className?.label)}>
        {label}
      </span>
    );
  // Without a description, the label is a direct flex child so that hiding it
  // (e.g. `hidden sm:inline`) also removes the gap.
  const text =
    description === undefined ? (
      labelNode
    ) : (
      <span className={cn("flex flex-col text-left", className?.text)}>
        {labelNode}
        <span
          className={cn("text-foreground/60 text-xs", className?.description)}
        >
          {description}
        </span>
      </span>
    );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="toggle-switch"
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => {
        onCheckedChange(!checked);
      }}
      className={cn(
        "group/toggle-switch inline-flex cursor-pointer items-center gap-2 rounded-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className?.root,
      )}
      {...props}
    >
      {labelPosition === "start" && text}
      <span
        data-slot="toggle-switch-track"
        className={cn(toggleSwitchTrackVariants({ size }), className?.track)}
      >
        <span
          className={cn(toggleSwitchThumbVariants({ size }), className?.thumb)}
        />
      </span>
      {labelPosition === "end" && text}
    </button>
  );
}
