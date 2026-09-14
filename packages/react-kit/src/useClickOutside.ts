"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onClickOutside` when a pointer event fires outside the returned
 * ref's element — the classic pattern behind closing a dropdown, popover or
 * modal when the user clicks elsewhere.
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 * return <div ref={ref}>{open && <Menu />}</div>;
 */
export function useClickOutside<T extends HTMLElement>(
  onClickOutside: () => void,
) {
  const ref = useRef<T>(null);
  const onClickOutsideRef = useRef(onClickOutside);

  useEffect(() => {
    onClickOutsideRef.current = onClickOutside;
  }, [onClickOutside]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      onClickOutsideRef.current();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return ref;
}
