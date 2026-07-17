"use client";

import * as React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface SortableProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * A drag-to-reorder list — built on the browser's native HTML5 drag
 * events rather than a drag-and-drop library, since reordering a flat
 * list (no cross-container drops, no sortable grids) doesn't need one.
 *
 * @see https://ui-x.junwen-k.dev/docs/utilities/sortable
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Sortable<T>({
  items,
  onReorder,
  getKey,
  renderItem,
  disabled = false,
  className,
}: SortableProps<T>) {
  const dragIndexRef = React.useRef<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  function handleDrop(targetIndex: number) {
    const from = dragIndexRef.current;
    if (from === null || from === targetIndex) {
      return;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (moved !== undefined) {
      next.splice(targetIndex, 0, moved);
      onReorder(next);
    }
    dragIndexRef.current = null;
    setOverIndex(null);
  }

  return (
    <ul data-slot="sortable" className={cn("grid gap-2", className)}>
      {items.map((item, index) => (
        <li
          key={getKey(item)}
          draggable={!disabled}
          data-dragging-over={overIndex === index}
          onDragStart={() => {
            dragIndexRef.current = index;
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(index);
          }}
          onDragLeave={() => {
            setOverIndex((prev) => (prev === index ? null : prev));
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(index);
          }}
          onDragEnd={() => {
            dragIndexRef.current = null;
            setOverIndex(null);
          }}
          className={cn(
            "data-[dragging-over=true]:ring-primary rounded-md data-[dragging-over=true]:ring-2",
            !disabled && "cursor-grab active:cursor-grabbing",
          )}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
