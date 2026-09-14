import { describe, expect, it } from "vitest";

import { groupBy } from "./groupBy.js";

describe("groupBy", () => {
  it("groups elements by the computed key", () => {
    expect(
      groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd")),
    ).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });

  it("returns an empty object for an empty array", () => {
    expect(groupBy([], (n: number) => n)).toEqual({});
  });

  it("preserves the original element order within each group", () => {
    const items = [
      { type: "a", id: 1 },
      { type: "b", id: 2 },
      { type: "a", id: 3 },
    ];
    expect(groupBy(items, (item) => item.type)).toEqual({
      a: [
        { type: "a", id: 1 },
        { type: "a", id: 3 },
      ],
      b: [{ type: "b", id: 2 }],
    });
  });
});
