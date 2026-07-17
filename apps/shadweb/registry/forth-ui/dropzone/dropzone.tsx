"use client";

import * as React from "react";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  FileList,
  FileListAction,
  FileListActions,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
} from "@/components/forth-ui/file-list";

export interface DropzoneProps {
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  /** Maximum size per file, in bytes. Oversized files are silently dropped. */
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent] ?? "B"}`;
}

function fileKey(file: File) {
  return `${file.name}-${file.size.toString()}-${file.lastModified.toString()}`;
}

/**
 * A drag-and-drop file upload zone, listing accepted files below via
 * `FileList`.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/dropzone
 * @see https://ui.aceternity.com/components/file-upload
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Dropzone({
  value,
  defaultValue,
  onValueChange,
  accept,
  multiple = true,
  maxFiles,
  maxSize,
  disabled = false,
  className,
}: DropzoneProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? [],
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const files = value ?? uncontrolledValue;

  function update(next: File[]) {
    setUncontrolledValue(next);
    onValueChange?.(next);
  }

  function addFiles(incoming: FileList | File[]) {
    let next = [...files, ...Array.from(incoming)];
    if (maxSize !== undefined) {
      next = next.filter((file) => file.size <= maxSize);
    }
    if (maxFiles !== undefined) {
      next = next.slice(0, maxFiles);
    }
    update(next);
  }

  function removeFile(file: File) {
    update(files.filter((f) => f !== file));
  }

  function openFileDialog() {
    if (!disabled) {
      inputRef.current?.click();
    }
  }

  return (
    <div data-slot="dropzone" className="grid gap-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        data-dragging={isDragging}
        aria-disabled={disabled}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openFileDialog();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) {
            addFiles(e.dataTransfer.files);
          }
        }}
        className={cn(
          "border-input hover:bg-accent/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors",
          "data-[dragging=true]:border-primary data-[dragging=true]:bg-accent/50",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          className,
        )}
      >
        <UploadIcon className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">
          Drag & drop files here, or click to select
        </p>
        {maxSize !== undefined && (
          <p className="text-muted-foreground text-xs">
            Max file size: {formatBytes(maxSize)}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            if (e.target.files !== null) {
              addFiles(e.target.files);
            }
            e.target.value = "";
          }}
        />
      </div>
      {files.length > 0 && (
        <FileList>
          {files.map((file) => (
            <FileListItem key={fileKey(file)}>
              <FileListHeader>
                <FileListIcon>
                  <FileIcon />
                </FileListIcon>
                <FileListInfo>
                  <FileListName>{file.name}</FileListName>
                  <FileListDescription>
                    {formatBytes(file.size)}
                  </FileListDescription>
                </FileListInfo>
                <FileListActions>
                  <FileListAction
                    onClick={() => {
                      removeFile(file);
                    }}
                    aria-label="Remove file"
                  >
                    <XIcon />
                  </FileListAction>
                </FileListActions>
              </FileListHeader>
            </FileListItem>
          ))}
        </FileList>
      )}
    </div>
  );
}
