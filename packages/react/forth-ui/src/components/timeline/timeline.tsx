import type React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface TimelineItemData {
  title: React.ReactNode;
  description?: React.ReactNode;
  date?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItemData[];
  className?: string;
}

/**
 * A vertical sequence of dated events, connected by a line.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://originui.com/timeline
 * @see https://ui.aceternity.com/components/timeline
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol data-slot="timeline" className={cn("grid", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- `title` is an arbitrary ReactNode with no guaranteed unique field
          <li key={index} className="grid grid-cols-[2rem_1fr] gap-x-3">
            <div className="flex flex-col items-center">
              <span className="border-primary bg-background text-primary flex size-8 shrink-0 items-center justify-center rounded-full border [&>svg]:size-4">
                {item.icon}
              </span>
              {!isLast && (
                <span aria-hidden="true" className="bg-border w-px flex-1" />
              )}
            </div>
            <div className={cn("grid gap-1", !isLast && "pb-6")}>
              {item.date !== undefined && (
                <p className="text-muted-foreground text-xs">{item.date}</p>
              )}
              <p className="text-sm font-medium">{item.title}</p>
              {item.description !== undefined && (
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
