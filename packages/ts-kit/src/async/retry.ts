import { abortReason } from "./abortReason.js";
import { sleep } from "./sleep.js";

export interface RetryOptions {
  /** Maximum number of attempts, including the first one (default: 3). */
  attempts?: number;
  /** Base delay in milliseconds before retrying (default: 200). */
  delayMs?: number;
  /** Backoff multiplier applied to `delayMs` after each failed attempt (default: 2). */
  backoffFactor?: number;
  /** Upper bound for a single delay between two attempts (default: none). */
  maxDelayMs?: number;
  /**
   * Decides whether a failure is worth retrying — return `false` to rethrow
   * it right away (e.g. a 4xx response that won't fix itself). Retries every
   * error by default.
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Called with the error and the 1-based attempt number before each retry. */
  onRetry?: (error: unknown, attempt: number) => void;
  /** Stops retrying (rejecting with the abort reason) once aborted. */
  signal?: AbortSignal;
}

/**
 * Retries an async operation with exponential backoff.
 *
 * @param fn - The operation to retry. Receives the 1-based attempt number.
 * @param options - Retry configuration.
 * @returns The result of the first successful attempt.
 * @throws The last error once attempts are exhausted, the first error
 *   `shouldRetry` declines, or the abort reason once `signal` is aborted.
 * @example
 * const data = await retry(() => fetchJson("/api"), {
 *   attempts: 5,
 *   delayMs: 300,
 *   shouldRetry: (error) => !(error instanceof HttpError && error.status < 500),
 * });
 */
export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    attempts = 3,
    delayMs = 200,
    backoffFactor = 2,
    maxDelayMs = Infinity,
    shouldRetry,
    onRetry,
    signal,
  } = options;
  const maxAttempts = Math.max(1, attempts);

  let currentDelay = delayMs;
  for (let attempt = 1; ; attempt++) {
    if (signal?.aborted) throw abortReason(signal);
    try {
      return await fn(attempt);
    } catch (error) {
      const canRetry =
        attempt < maxAttempts && (shouldRetry?.(error, attempt) ?? true);
      if (!canRetry) throw error;
      onRetry?.(error, attempt);
      await sleep(Math.min(currentDelay, maxDelayMs), signal);
      currentDelay *= backoffFactor;
    }
  }
}
