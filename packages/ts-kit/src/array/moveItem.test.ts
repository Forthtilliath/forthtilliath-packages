import { describe, expect, it } from "vitest";

import { moveItem } from "./moveItem.js";

describe("moveItem", () => {
  it("moves an element forward, shifting the others back", () => {
    expect(moveItem(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"]);
  });

  it("moves an element backward", () => {
    expect(moveItem(["a", "b", "c"], 2, -1)).toEqual(["a", "c", "b"]);
    expect(moveItem(["a", "b", "c"], 2, -2)).toEqual(["c", "a", "b"]);
  });

  it("does not mutate the original array", () => {
    const items = ["a", "b", "c"];
    const result = moveItem(items, 0, 1);
    expect(items).toEqual(["a", "b", "c"]);
    expect(result).not.toBe(items);
  });

  it("returns the same array when nothing moves", () => {
    const items = ["a", "b", "c"];
    expect(moveItem(items, 1, 0)).toBe(items);
    expect(moveItem(items, 0, -1)).toBe(items);
    expect(moveItem(items, 2, 1)).toBe(items);
    expect(moveItem(items, 5, -4)).toBe(items);
    expect(moveItem(items, -1, 1)).toBe(items);
    expect(moveItem(items, 0.5, 1)).toBe(items);
  });
});
