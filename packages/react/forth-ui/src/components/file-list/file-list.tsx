import type React from "react";

import { Progress } from "@forthtilliath/shadcn-ui/components/progress";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

/**
 * Displays a list of files with details such as name, size, and upload
 * progress — a composable set of primitives, not a single all-in-one prop
 * API (matches the source's own composition style).
 *
 * _Inspired from multiple sources, to make a consistent and reusable
 * component._
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

/**
 * One file of a {@link FileList}: a bordered `<li>` stacking a header and
 * optional content (progress…).
 * @param props - Any `<li>` prop.
 */
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

/**
 * The row of a file: icon, info, actions.
 * @param props - Any `<div>` prop.
 */
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

/**
 * Box for the file type icon (an `svg` child is sized for you).
 * @param props - Any `<div>` prop.
 */
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

/**
 * Column holding the name and description, taking the remaining width.
 * @param props - Any `<div>` prop.
 */
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

/**
 * The file name, truncated with an ellipsis when too long.
 * @param props - Any `<p>` prop.
 */
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

/**
 * Secondary line (size, type, status…), with parts separated by {@link
 * FileListDescriptionSeparator}.
 * @param props - Any `<p>` prop.
 */
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

/**
 * A middle dot between two parts of a description, hidden from screen readers.
 * @param props - Any `<span>` prop.
 */
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

/**
 * Row of action buttons at the end of the header.
 * @param props - Any `<div>` prop.
 */
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

/**
 * An icon button of the actions row (remove, retry…). Give it an `aria-label`:
 * it has no visible text.
 * @param props - Any `<button>` prop (`type="button"` by default).
 */
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

/**
 * Area under the header, e.g. for a {@link FileListProgress}.
 * @param props - Any `<div>` prop.
 */
export function FileListContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="file-list-content" className={cn(className)} {...props} />
  );
}

/**
 * Props of {@link FileListProgress}: those of shadcn-ui's `Progress` (`value`
 * from 0 to 100…).
 */
export type FileListProgressProps = React.ComponentProps<typeof Progress>;

/**
 * Wraps shadcn-ui's `Progress` for the upload-progress row. Give it an
 * `aria-label` (e.g. "Uploading report.pdf"): a progress bar needs a name.
 */
export function FileListProgress(props: FileListProgressProps) {
  return <Progress data-slot="file-list-progress" {...props} />;
}
