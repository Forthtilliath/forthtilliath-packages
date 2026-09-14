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

  it("propagates the original promise's rejection", async () => {
    const promise = withTimeout(Promise.reject(new Error("boom")), 1000);
    const assertion = expect(promise).rejects.toThrow("boom");
    await vi.advanceTimersByTimeAsync(0);
    await assertion;
  });
});
