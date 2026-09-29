import { describe, expect, expectTypeOf, it } from "vitest";

import { flattenDeep } from "./flattenDeep.js";

describe("flattenDeep", () => {
  it("flattens a single level of nesting", () => {
    expect(flattenDeep([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  });

  it("flattens deeply nested arrays", () => {
    expect(flattenDeep([1, [2, [3, [4, [5]]]]])).toEqual([1, 2, 3, 4, 5]);
  });

  it("flattens multiple sibling nested arrays", () => {
    expect(flattenDeep([[1, 2], [3, [4, 5]], [[6]]])).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });

  it("returns an empty array for an empty input", () => {
    expect(flattenDeep([])).toEqual([]);
  });

  it("returns the same values for an already-flat array", () => {
    expect(flattenDeep([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("handles arrays containing empty nested arrays", () => {
    expect(flattenDeep([1, [], [2, []], 3])).toEqual([1, 2, 3]);
  });

  it("types the result as the innermost element type", () => {
    const nested: number[][][] = [[[1]], [[2, 3]]];
    expectTypeOf(flattenDeep(nested)).toEqualTypeOf<number[]>();
    expectTypeOf(flattenDeep([1, ["a", [true]]] as const)).toEqualTypeOf<
      (1 | "a" | true)[]
    >();
  });

  it("does not mutate the original array", () => {
    const input = [1, [2, 3], [4, [5]]];
    flattenDeep(input);
    expect(input).toEqual([1, [2, 3], [4, [5]]]);
  });
});
