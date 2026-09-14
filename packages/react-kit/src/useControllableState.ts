"use client";

import { useCallback, useState } from "react";

export interface UseControllableStateOptions<T> {
  /** Value from the parent — when set, the state becomes controlled. */
  value?: T;
  /** Initial value for the uncontrolled case. */
  defaultValue?: T;
  /** Called with the next value on every change, controlled or not. */
  onChange?: (value: T) => void;
}

/**
 * Backs a headless/design-system component that must support both
 * controlled (`value` + `onChange`, parent owns the state) and uncontrolled
 * (`defaultValue`, component owns the state) usage with a single code path —
 * the pattern behind most Radix-style primitives.
 *
 * @example
 * function Toggle({ value, defaultValue, onChange }: ToggleProps) {
 *   const [pressed, setPressed] = useControllableState({ value, defaultValue, onChange });
 *   return <button onClick={() => setPressed(!pressed)}>{pressed ? "On" : "Off"}</button>;
 * }
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue] as const;
}
