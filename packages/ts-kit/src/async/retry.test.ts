import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { retry } from "./retry.js";

describe("retry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the result on the first successful attempt", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(retry(fn, { delayMs: 10 })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries after a failure and eventually succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockResolvedValueOnce("ok");

    const promise = retry(fn, { attempts: 3, delayMs: 100 });
    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws the last error once every attempt is exhausted", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("always fails"));
    const onRetry = vi.fn();

    const promise = retry(fn, { attempts: 3, delayMs: 10, onRetry });
    const assertion = expect(promise).rejects.toThrow("always fails");

    await vi.advanceTimersByTimeAsync(10);
    await vi.advanceTimersByTimeAsync(20);
    await assertion;

    expect(fn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(3);
  });

  it("applies exponential backoff between attempts", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    const promise = retry(fn, {
      attempts: 3,
      delayMs: 100,
      backoffFactor: 2,
    }).catch(() => "caught");

    expect(fn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(199);
    expect(fn).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(3);

    await promise;
  });
});
