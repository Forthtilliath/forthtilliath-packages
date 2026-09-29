"use client";

import { useCallback, useState } from "react";

/**
 * A boolean state with a stable `toggle()` — for open/closed, shown/hidden,
 * on/off switches.
 *
 * @param defaultValue - The initial value (defaults to `false`).
 * @returns `[value, setValue, toggle]` — `setValue` is React's own setter,
 *   `toggle` flips the value and keeps the same identity across renders.
 * @example
 * const [isOpen, setIsOpen, toggleOpen] = useToggleState();
 * <button onClick={toggleOpen}>{isOpen ? "Close" : "Open"}</button>
 */
export function useToggleState(defaultValue?: boolean) {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, setValue, toggle] as const;
}
