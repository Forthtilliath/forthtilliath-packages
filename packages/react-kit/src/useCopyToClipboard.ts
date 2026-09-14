"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text to the clipboard via the async Clipboard API and tracks the
 * last copied value, auto-clearing it after `resetDelayMs` — handy to drive
 * a "Copied!" state on a copy button.
 *
 * @example
 * const [copiedText, copy] = useCopyToClipboard();
 * <button onClick={() => copy(code)}>{copiedText ? "Copied!" : "Copy"}</button>
 */
export function useCopyToClipboard(resetDelayMs = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (typeof navigator === "undefined") {
        return false;
      }

      try {
        // `navigator.clipboard` can still be missing at runtime (older
        // browsers, insecure context) even though its type says otherwise —
        // an unavailable API throws here and is handled below like any
        // other failure.
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopiedText(null);
        }, resetDelayMs);
        return true;
      } catch {
        setCopiedText(null);
        return false;
      }
    },
    [resetDelayMs],
  );

  return [copiedText, copy] as const;
}
