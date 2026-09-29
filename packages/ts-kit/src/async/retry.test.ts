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
    // Only before an actual retry: not after the last, failed attempt.
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenLastCalledWith(expect.any(Error), 2);
  });

  it("rethrows right away when shouldRetry declines the error", async () => {
    const fatal = new Error("404");
    const fn = vi.fn().mockRejectedValue(fatal);
    const shouldRetry = vi.fn(() => false);

    await expect(retry(fn, { attempts: 5, shouldRetry })).rejects.toBe(fatal);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledWith(fatal, 1);
  });

  it("caps each delay at maxDelayMs", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("1"))
      .mockRejectedValueOnce(new Error("2"))
      .mockResolvedValueOnce("ok");

    const promise = retry(fn, {
      attempts: 3,
      delayMs: 100,
      backoffFactor: 10,
      maxDelayMs: 150,
    });
    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(2);
    // Uncapped, the second delay would be 1000 ms.
    await vi.advanceTimersByTimeAsync(150);
    await expect(promise).resolves.toBe("ok");
  });

  it("stops waiting and rejects when the signal aborts", async () => {
    const controller = new AbortController();
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    const promise = retry(fn, {
      attempts: 5,
      delayMs: 1000,
      signal: controller.signal,
    });
    const assertion = expect(promise).rejects.toThrow("stop");
    await vi.advanceTimersByTimeAsync(0);
    controller.abort(new Error("stop"));
    await assertion;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("doesn't call fn at all with an already-aborted signal", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(
      retry(fn, { signal: AbortSignal.abort() }),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fn).not.toHaveBeenCalled();
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
