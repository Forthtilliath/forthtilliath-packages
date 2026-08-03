import { describe, expect, it } from "vitest";

import { chunk } from "./chunk.js";

describe("chunk", () => {
  it("splits an array into evenly sized chunks", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });

  it("returns a single chunk when size is >= array length", () => {
    expect(chunk([1, 2, 3, 4, 5], 6)).toEqual([[1, 2, 3, 4, 5]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  it("returns an empty array when size is 0 or negative", () => {
    expect(chunk([1, 2, 3, 4, 5], 0)).toEqual([]);
    expect(chunk([1, 2, 3, 4, 5], -1)).toEqual([]);
  });

  it("returns an empty array when given an empty array", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(chunk([1], 2)).toEqual([[1]]);
  });

  it("does not mutate the original array", () => {
    const input = [1, 2, 3, 4, 5];
    chunk(input, 2);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});
