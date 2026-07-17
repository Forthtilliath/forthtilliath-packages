"use client";

import * as React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { Badge } from "../badge";

export interface TagsInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Maximum number of tags allowed. */
  max?: number;
  className?: string;
}

/**
 * A flexible input for adding/removing multiple tags — `Enter`/`,` commits
 * the current text as a tag, `Backspace` on an empty input removes the
 * last one. Renders tags as forth-ui's own dismissible `Badge`.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.hextaui.com/docs/ui/components/tag-input
 * @see https://www.kibo-ui.com/components/tags
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function TagsInput({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Add tag…",
  disabled = false,
  max,
  className,
}: TagsInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? [],
  );
  const [inputValue, setInputValue] = React.useState("");
  const tags = value ?? uncontrolledValue;

  function update(next: string[]) {
    setUncontrolledValue(next);
    onValueChange?.(next);
  }

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed.length === 0 || tags.includes(trimmed)) {
      return;
    }
    if (max !== undefined && tags.length >= max) {
      return;
    }
    update([...tags, trimmed]);
    setInputValue("");
  }

  function removeTag(tag: string) {
    update(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      return;
    }
    if (e.key === "Backspace" && inputValue.length === 0) {
      const lastTag = tags.at(-1);
      if (lastTag !== undefined) {
        removeTag(lastTag);
      }
    }
  }

  return (
    <div
      data-slot="tags-input"
      className={cn(
        "border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
    >
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          dismissible
          open
          onOpenChange={() => {
            removeTag(tag);
          }}
        >
          {tag}
        </Badge>
      ))}
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          addTag(inputValue);
        }}
        placeholder={tags.length === 0 ? placeholder : undefined}
        disabled={disabled}
        className="placeholder:text-muted-foreground min-w-24 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
