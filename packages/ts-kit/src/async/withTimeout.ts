/**
 * Thrown by {@link withTimeout} when the wrapped promise does not settle in
 * time.
 */
export class TimeoutError extends Error {
  constructor(message = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Rejects with a {@link TimeoutError} if `promise` has not settled within
 * `ms` milliseconds.
 *
 * @param promise - The promise to race against the timeout.
 * @param ms - The timeout in milliseconds.
 * @param message - Optional error message (defaults to a generic one).
 * @example
 * await withTimeout(fetch("/api"), 5000);
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(message));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
