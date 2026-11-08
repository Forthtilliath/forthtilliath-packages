import { describe, expect, it } from "vitest";

import { pickRandomOrThrow } from "./pickRandomOrThrow.js";

describe("pickRandomOrThrow", () => {
  it("throws a RangeError on an empty array", () => {
    expect(() => pickRandomOrThrow([])).toThrow(RangeError);
  });

  it("uses the given random source", () => {
    const items = ["a", "b", "c"];
    expect(pickRandomOrThrow(items, () => 0)).toBe("a");
    expect(pickRandomOrThrow(items, () => 0.999_999)).toBe("c");
  });

  it("returns falsy elements as they are", () => {
    expect(pickRandomOrThrow([0])).toBe(0);
    expect(pickRandomOrThrow([""])).toBe("");
  });
});
