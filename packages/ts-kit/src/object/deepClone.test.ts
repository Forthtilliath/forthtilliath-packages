import { describe, expect, it } from "vitest";

import { deepClone } from "./deepClone.js";

describe("deepClone", () => {
  it("produces a deeply equal but distinct copy", () => {
    const original = { a: 1, b: { c: [1, 2, 3] } };
    const clone = deepClone(original);

    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.b).not.toBe(original.b);
    expect(clone.b.c).not.toBe(original.b.c);
  });

  it("mutating the clone does not affect the original", () => {
    const original = { list: [1, 2, 3] };
    const clone = deepClone(original);

    clone.list.push(4);

    expect(original.list).toEqual([1, 2, 3]);
    expect(clone.list).toEqual([1, 2, 3, 4]);
  });

  it("clones primitives as-is", () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone("hello")).toBe("hello");
    expect(deepClone(null)).toBeNull();
  });
});
