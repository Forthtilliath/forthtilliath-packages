import { abortReason } from "./abortReason.js";

/**
 * Resolves after the given number of milliseconds.
 *
 * @param ms - The delay in milliseconds.
 * @param signal - Rejects early (with the abort reason) when aborted.
 * @example
 * await sleep(1000); // waits 1 second
 */
// Rejects with the caller's own abort reason, whatever its type — like
// `fetch` does.
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortReason(signal));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      if (signal) reject(abortReason(signal));
    };
    /* eslint-enable @typescript-eslint/prefer-promise-reject-errors */
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
