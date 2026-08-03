import { useCallback, useEffect } from "react";

interface KeyConfig {
  key?: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export const SPECIAL_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  BACKSPACE: "Backspace",
  TAB: "Tab",
} as const;

export function useKeyListener(config: KeyConfig, onKeyDown: () => void) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const matchesKey = !config.key || event.key === config.key;
      const matchesCtrl = !config.ctrl || event.ctrlKey;
      const matchesShift = !config.shift || event.shiftKey;
      const matchesAlt = !config.alt || event.altKey;
      const matchesMeta = !config.meta || event.metaKey;

      if (
        matchesKey &&
        matchesCtrl &&
        matchesShift &&
        matchesAlt &&
        matchesMeta
      ) {
        onKeyDown();
      }
    },
    [config.alt, config.ctrl, config.key, config.meta, config.shift, onKeyDown],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
