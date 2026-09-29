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
 * Rejects with a {@link TimeoutError} if `operation` has not settled within
 * `ms` milliseconds.
 *
 * Pass a function rather than a promise to also **cancel** the operation on
 * timeout: it receives an `AbortSignal`, aborted (with the `TimeoutError`)
 * when time runs out — hand it to `fetch` or any abortable API. A plain
 * promise can only be given up on, not stopped.
 *
 * @param operation - The promise to race against the timeout, or a function
 *   starting the operation with the given `AbortSignal`.
 * @param ms - The timeout in milliseconds.
 * @param message - Optional error message (defaults to a generic one).
 * @example
 * await withTimeout((signal) => fetch("/api", { signal }), 5000); // aborted on timeout
 * await withTimeout(somePromise, 5000); // only stops waiting
 */
export function withTimeout<T>(
  operation: Promise<T> | ((signal: AbortSignal) => Promise<T>),
  ms: number,
  message?: string,
): Promise<T> {
  const controller = new AbortController();
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new TimeoutError(message);
      controller.abort(error);
      reject(error);
    }, ms);
    const fail = (error: unknown) => {
      clearTimeout(timer);
      reject(error instanceof Error ? error : new Error(String(error)));
    };
    let promise: Promise<T>;
    try {
      promise =
        typeof operation === "function"
          ? operation(controller.signal)
          : operation;
    } catch (error) {
      fail(error);
      return;
    }
    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }, fail);
  });
}
