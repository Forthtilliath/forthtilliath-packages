import { useRef, useState } from "react";

// Blocks a second call while a first one is still running (e.g. a double tap
// on a "Save" button before it had time to disable itself, which would create
// duplicate submissions). The lock is a ref, not the `isSaving` state: two
// taps handled before the re-render would both still read the stale `false`.
export function useSubmitGuard() {
  const [isSaving, setIsSaving] = useState(false);
  const inFlightRef = useRef(false);

  async function guard(action: () => Promise<void>) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);
    try {
      await action();
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  }

  return { isSaving, guard };
}
