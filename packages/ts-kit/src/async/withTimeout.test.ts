import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TimeoutError, withTimeout } from "./withTimeout.js";

describe("withTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with the promise's value when it settles in time", async () => {
    const promise = withTimeout(Promise.resolve("done"), 1000);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBe("done");
  });

  it("rejects with a TimeoutError when the promise takes too long", async () => {
    const neverResolves = new Promise<string>(() => {
      /* never settles */
    });
    const promise = withTimeout(neverResolves, 1000);

    const assertion = expect(promise).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it("aborts the operation's signal on timeout, with the TimeoutError", async () => {
    let received: AbortSignal | undefined;
    const promise = withTimeout(
      (signal) =>
        new Promise<string>(() => {
          received = signal;
        }),
      1000,
      "too slow",
    );
    const assertion = expect(promise).rejects.toThrow("too slow");
    expect(received?.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
    expect(received?.aborted).toBe(true);
    expect(received?.reason).toBeInstanceOf(TimeoutError);
  });

  it("leaves the signal alone when the operation settles in time", async () => {
    let received: AbortSignal | undefined;
    const promise = withTimeout((signal) => {
      received = signal;
      return Promise.resolve("done");
    }, 1000);
    await expect(promise).resolves.toBe("done");
    await vi.advanceTimersByTimeAsync(1000);
    expect(received?.aborted).toBe(false);
  });

  it("rejects when the operation function throws synchronously", async () => {
    const promise = withTimeout(() => {
      throw new Error("sync boom");
    }, 1000);
    await expect(promise).rejects.toThrow("sync boom");
  });

  it("propagates the original promise's rejection", async () => {
    const promise = withTimeout(Promise.reject(new Error("boom")), 1000);
    const assertion = expect(promise).rejects.toThrow("boom");
    await vi.advanceTimersByTimeAsync(0);
    await assertion;
  });
});
