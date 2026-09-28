"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

import { ToggleSwitch } from "@/components/forth-ui/toggle-switch";

import type { ColumnMenuColumn } from "./types";

export interface SortableColumnRowProps<K extends string> {
  column: ColumnMenuColumn<K>;
  index: number;
  total: number;
  dragHandleLabel: string;
  onToggle: (key: K) => void;
}

/** One row of `ColumnMenu`: drag handle, visibility switch, position. */
export function SortableColumnRow<K extends string>({
  column,
  index,
  total,
  dragHandleLabel,
  onToggle,
}: SortableColumnRowProps<K>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  return (
    <div
      ref={setNodeRef}
      data-slot="column-menu-row"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        isDragging ? "bg-primary/5 border-primary/20 border" : "hover:bg-muted",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={dragHandleLabel}
        title={dragHandleLabel}
        className="text-foreground/30 hover:text-foreground/60 shrink-0 cursor-grab touch-none transition-colors active:cursor-grabbing"
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <ToggleSwitch
        size="sm"
        checked={column.visible}
        onCheckedChange={() => {
          onToggle(column.key);
        }}
        label={column.label}
        className={{
          root: "flex-1 gap-3",
          label:
            "text-foreground/40 group-data-[state=checked]/toggle-switch:text-foreground flex-1 text-left transition-colors",
        }}
      />
      <span className="text-foreground/30 shrink-0 font-mono text-xs">
        {index + 1}/{total}
      </span>
    </div>
  );
}
