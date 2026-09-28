"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import { SortableColumnRow } from "./sortable-column-row";
import type { ColumnMenuColumn, ColumnMenuLabels } from "./types";
import { DEFAULT_COLUMN_MENU_LABELS } from "./types";
import { useDndSensors } from "./use-dnd-sensors";

export interface ColumnMenuProps<C extends ColumnMenuColumn> {
  columns: C[];
  /** Restored by the reset button. */
  defaultColumns: C[];
  /** Receives an updater, so a `useState` setter can be passed directly. */
  onColumnsChange: (update: (prev: C[]) => C[]) => void;
  /** Overrides some or all of the displayed texts. */
  labels?: Partial<ColumnMenuLabels>;
  /** Side of the trigger the dropdown is aligned to (default: `"end"`). */
  align?: "start" | "end";
  /**
   * Custom classes for each part of the component.
   *
   * - `root` wraps the trigger and the dropdown.
   * - `trigger` is the toggle button.
   * - `content` is the dropdown panel.
   */
  className?: Partial<Record<"root" | "trigger" | "content", string>>;
}

/**
 * A dropdown to show/hide and reorder (drag and drop, touch and keyboard
 * included) the columns of a table, with a "visible / total" counter and a
 * reset button. Closes on outside click and `Escape`.
 *
 * Pair it with `createColumnStorage` from `@forthtilliath/ts-kit` to persist
 * the user's layout.
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ColumnMenu<C extends ColumnMenuColumn>({
  columns,
  defaultColumns,
  onColumnsChange,
  labels,
  align = "end",
  className,
}: ColumnMenuProps<C>) {
  const text = { ...DEFAULT_COLUMN_MENU_LABELS, ...labels };
  // Stable id: avoids a hydration mismatch on dnd-kit's aria-describedby
  const dndId = useId();
  const contentId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const sensors = useDndSensors();

  const visibleCount = columns.filter((c) => c.visible).length;
  const allVisible = visibleCount === columns.length;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    onColumnsChange((prev) => {
      const oldIndex = prev.findIndex((c) => c.key === active.id);
      const newIndex = prev.findIndex((c) => c.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function toggleColumn(key: C["key"]) {
    onColumnsChange((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
    );
  }

  function reset() {
    onColumnsChange(() => defaultColumns);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      data-slot="column-menu"
      className={cn("relative", className?.root)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => {
          setOpen((v) => !v);
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-all",
          open
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-foreground/60 hover:border-primary hover:text-foreground",
          className?.trigger,
        )}
      >
        <span className="hidden sm:inline">{text.trigger}</span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-xs font-medium",
            allVisible
              ? "bg-foreground/10 text-foreground/40"
              : "bg-primary text-primary-foreground",
          )}
        >
          {visibleCount}/{columns.length}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 opacity-60 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={contentId}
          data-slot="column-menu-content"
          className={cn(
            "bg-background border-border absolute top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl",
            align === "end" ? "right-0" : "left-0",
            className?.content,
          )}
        >
          <div className="border-border bg-muted flex items-center justify-between border-b px-4 py-3">
            <p className="text-foreground text-xs font-medium">{text.title}</p>
            <button
              type="button"
              onClick={reset}
              className="text-foreground/50 hover:text-primary flex items-center gap-1 text-xs transition-colors"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              {text.reset}
            </button>
          </div>
          <p className="border-border bg-muted/50 text-foreground/50 border-b px-4 py-2 text-xs">
            {text.hint}
          </p>
          <div className="p-2">
            <DndContext
              id={dndId}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns.map((c) => c.key)}
                strategy={verticalListSortingStrategy}
              >
                {columns.map((column, index) => (
                  <SortableColumnRow
                    key={column.key}
                    column={column}
                    index={index}
                    total={columns.length}
                    dragHandleLabel={text.dragHandle(column.label)}
                    onToggle={toggleColumn}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
}
