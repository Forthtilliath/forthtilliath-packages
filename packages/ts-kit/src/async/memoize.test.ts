import { describe, expect, it, vi } from "vitest";

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

  it("exposes the underlying cache", () => {
    const memoized = memoize((n: number) => n * 2);
    memoized(3);

    expect(memoized.cache.get(JSON.stringify([3]))).toBe(6);
  });
});
