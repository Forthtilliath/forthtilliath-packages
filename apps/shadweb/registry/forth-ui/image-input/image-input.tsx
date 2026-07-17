"use client";

import * as React from "react";
import { ImageIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ImageInputProps {
  /** An existing image URL to preview (e.g. editing something that already has one). */
  value?: string | null;
  onFileChange?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
  /** @default "16/9" */
  aspectRatio?: string;
}

/**
 * A click-to-upload image picker with a live preview.
 *
 * @see https://ktui.io/docs/image-input
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ImageInput({
  value,
  onFileChange,
  disabled = false,
  className,
  aspectRatio = "16/9",
}: ImageInputProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (file === null) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect, react-hooks/set-state-in-effect -- syncs the object URL lifecycle (create/revoke) with the selected File, an external browser resource that can't be derived during render
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- see above
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const preview = objectUrl ?? value ?? null;

  function handleFile(next: File | null) {
    setFile(next);
    onFileChange?.(next);
  }

  return (
    <div
      data-slot="image-input"
      className={cn(
        "border-input relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      style={{ aspectRatio }}
    >
      {preview !== null ? (
        <>
          <img src={preview} alt="" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => {
              handleFile(null);
            }}
            aria-label="Remove image"
            className="bg-background/80 text-foreground hover:bg-background absolute top-2 right-2 rounded-full p-1 shadow-xs"
          >
            <XIcon className="size-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            inputRef.current?.click();
          }}
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-2 p-8 text-sm"
        >
          <ImageIcon className="size-8" />
          Click to upload an image
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </div>
  );
}
