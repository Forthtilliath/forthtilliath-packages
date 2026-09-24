import { describe, expect, it } from "vitest";

import { swapItems } from "./swapItems.js";

describe("swapItems", () => {
  it("swaps the elements at both positions", () => {
    expect(swapItems(["a", "b", "c"], 0, 2)).toEqual(["c", "b", "a"]);
    expect(swapItems(["a", "b", "c"], 2, 1)).toEqual(["a", "c", "b"]);
  });

  it("does not mutate the original array", () => {
    const items = ["a", "b", "c"];
    const result = swapItems(items, 0, 1);
    expect(items).toEqual(["a", "b", "c"]);
    expect(result).not.toBe(items);
  });

  it("returns a plain copy when swapping a position with itself", () => {
    expect(swapItems(["a", "b"], 1, 1)).toEqual(["a", "b"]);
  });

  it("returns a plain copy when a position is out of bounds", () => {
    expect(swapItems(["a", "b", "c"], 0, 5)).toEqual(["a", "b", "c"]);
    expect(swapItems(["a", "b", "c"], -1, 1)).toEqual(["a", "b", "c"]);
    expect(swapItems([], 0, 1)).toEqual([]);
  });
});
