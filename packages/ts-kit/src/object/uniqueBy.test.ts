import { describe, expect, it } from "vitest";

import { uniqueBy } from "./uniqueBy.js";

describe("uniqueBy", () => {
  it("keeps only the first element for each key", () => {
    expect(
      uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], (item) => item.id),
    ).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("returns an empty array for an empty input", () => {
    expect(uniqueBy([], (n: number) => n)).toEqual([]);
  });

  it("returns all elements when every key is unique", () => {
    expect(uniqueBy([1, 2, 3], (n) => n)).toEqual([1, 2, 3]);
  });
});
