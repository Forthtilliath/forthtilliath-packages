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

  it("returns false when a key is missing from the other object", () => {
    expect(deepEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  it("compares dates by timestamp", () => {
    expect(deepEqual(new Date(1), new Date(1))).toBe(true);
    expect(deepEqual(new Date(1), new Date(2))).toBe(false);
    expect(deepEqual({ at: new Date(1) }, { at: new Date(2) })).toBe(false);
  });

  it("compares regular expressions by source and flags", () => {
    expect(deepEqual(/a/g, /a/g)).toBe(true);
    expect(deepEqual(/a/g, /b/g)).toBe(false);
    expect(deepEqual(/a/g, /a/i)).toBe(false);
  });

  it("compares maps by keys and deep values", () => {
    expect(
      deepEqual(new Map([["a", { x: 1 }]]), new Map([["a", { x: 1 }]])),
    ).toBe(true);
    expect(
      deepEqual(new Map([["a", { x: 1 }]]), new Map([["a", { x: 2 }]])),
    ).toBe(false);
    expect(deepEqual(new Map([["a", 1]]), new Map([["b", 1]]))).toBe(false);
  });

  it("compares sets by membership", () => {
    expect(deepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(deepEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });

  it("returns false for values with different prototypes", () => {
    expect(deepEqual(new Date(0), {})).toBe(false);
    expect(deepEqual(new Map(), new Set())).toBe(false);
  });
});
