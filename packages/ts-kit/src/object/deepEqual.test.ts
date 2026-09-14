import { describe, expect, it } from "vitest";

import { deepEqual } from "./deepEqual.js";

describe("deepEqual", () => {
  it("returns true for primitives that are strictly equal", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it("returns false for primitives that differ", () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("a", "b")).toBe(false);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  it("returns true for deeply equal objects", () => {
    expect(
      deepEqual({ a: [1, 2], b: { c: 3 } }, { a: [1, 2], b: { c: 3 } }),
    ).toBe(true);
  });

  it("returns false for objects with a differing nested value", () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it("returns false for objects with different key sets", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
  });

  it("returns true for deeply equal arrays", () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });

  it("returns false for arrays of different lengths", () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("returns false when comparing an array to a plain object", () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });
});
