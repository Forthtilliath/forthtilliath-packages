import { sleep } from "./sleep.js";

export interface RetryOptions {
  /** Maximum number of attempts, including the first one (default: 3). */
  attempts?: number;
  /** Base delay in milliseconds before retrying (default: 200). */
  delayMs?: number;
  /** Backoff multiplier applied to `delayMs` after each failed attempt (default: 2). */
  backoffFactor?: number;
  /** Called with the error and the 1-based attempt number after each failure. */
  onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Retries an async operation with exponential backoff.
 *
 * @param fn - The operation to retry. Receives the 1-based attempt number.
 * @param options - Retry configuration.
 * @returns The result of the first successful attempt.
 * @throws The last error, if every attempt failed.
 * @example
 * const data = await retry(() => fetch("/api").then((r) => r.json()), {
 *   attempts: 5,
 *   delayMs: 300,
 * });
 */
export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { attempts = 3, delayMs = 200, backoffFactor = 2, onRetry } = options;

  let lastError: unknown;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      onRetry?.(error, attempt);
      if (attempt < attempts) {
        await sleep(currentDelay);
        currentDelay *= backoffFactor;
      }
    }
  }

  throw lastError;
}
