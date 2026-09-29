/**
 * The error to reject with once `signal` is aborted: its `reason` (what was
 * passed to `abort()`), or a standard `AbortError` when the runtime doesn't
 * provide one (some React Native polyfills).
 *
 * Internal helper — not part of the package's public barrel.
 */
export function abortReason(signal: AbortSignal): unknown {
  return (
    (signal.reason as unknown) ??
    new DOMException("This operation was aborted", "AbortError")
  );
}
