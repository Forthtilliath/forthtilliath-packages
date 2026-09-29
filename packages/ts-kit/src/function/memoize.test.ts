import { describe, expect, it, vi } from "vitest";

import { memoize as deprecatedMemoize } from "../async/memoize.js";

import { memoize } from "./memoize.js";

describe("memoize", () => {
  it("only calls fn once per distinct argument tuple", () => {
    const fn = vi.fn((n: number) => n * 2);
    const memoized = memoize(fn);

    expect(memoized(4)).toBe(8);
    expect(memoized(4)).toBe(8);
    expect(memoized(5)).toBe(10);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("supports a custom key function", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn, (a, b) => `${a}-${b}`);

    memoized(1, 2);
    memoized(1, 2);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("supports a custom key function passed as an option", () => {
    const fn = vi.fn((user: { id: number }) => user.id);
    const memoized = memoize(fn, { getKey: (user) => String(user.id) });

    memoized({ id: 1 });
    memoized({ id: 1 });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("exposes the underlying cache", () => {
    const memoized = memoize((n: number) => n * 2);
    memoized(3);

    expect(memoized.cache.get(JSON.stringify([3]))).toBe(6);
  });

  it("evicts the least recently used result beyond maxSize", () => {
    const fn = vi.fn((n: number) => n * 2);
    const memoized = memoize(fn, { maxSize: 2 });

    memoized(1);
    memoized(2);
    memoized(1); // 1 is now more recent than 2
    memoized(3); // evicts 2

    expect([...memoized.cache.keys()]).toEqual(["[1]", "[3]"]);
    memoized(2);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("evicts a rejected promise so the next call retries", async () => {
    const fn = vi
      .fn<(id: number) => Promise<string>>()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce("ok");
    const memoized = memoize(fn);

    await expect(memoized(1)).rejects.toThrow("network");
    await expect(memoized(1)).resolves.toBe("ok");
    await expect(memoized(1)).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("is still importable from its former async/ location", () => {
    expect(deprecatedMemoize).toBe(memoize);
  });
});
