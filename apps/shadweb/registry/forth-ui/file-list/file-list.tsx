import type React from "react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Displays a list of files with details such as name, size, and upload
 * progress — a composable set of primitives, not a single all-in-one prop
 * API (matches the source's own composition style).
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui-x.junwen-k.dev/docs/components/file-list
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function FileList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="file-list"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export function FileListItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="file-list-item"
      className={cn(
        "border-border flex flex-col gap-2 rounded-lg border p-3",
        className,
      )}
      {...props}
    />
  );
}

export function FileListHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-list-header"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

export function FileListIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-list-icon"
      className={cn(
        "text-muted-foreground flex size-8 shrink-0 items-center justify-center [&>svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}

export function FileListInfo({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-list-info"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  );
}

export function FileListName({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="file-list-name"
      className={cn("truncate text-sm font-medium", className)}
      {...props}
    />
  );
}

export function FileListDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="file-list-description"
      className={cn(
        "text-muted-foreground flex items-center text-xs",
        className,
      )}
      {...props}
    />
  );
}

export function FileListDescriptionSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-list-description-separator"
      aria-hidden="true"
      className={cn("mx-1.5", className)}
      {...props}
    >
      &middot;
    </span>
  );
}

export function FileListActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-list-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  );
}

export function FileListAction({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="file-list-action"
      className={cn(
        "text-muted-foreground hover:text-foreground rounded-sm p-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-current [&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function FileListContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="file-list-content" className={cn(className)} {...props} />
  );
}

export type FileListProgressProps = React.ComponentProps<typeof Progress>;

/** Wraps shadcn-ui's `Progress` for the upload-progress row. */
export function FileListProgress(props: FileListProgressProps) {
  return <Progress data-slot="file-list-progress" {...props} />;
}
