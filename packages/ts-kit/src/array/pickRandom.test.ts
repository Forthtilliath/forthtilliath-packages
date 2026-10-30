import { describe, expect, it } from "vitest";

import { pickRandom } from "./pickRandom.js";

describe("pickRandom", () => {
  it("returns undefined for an empty array", () => {
    expect(pickRandom<number>([])).toBeUndefined();
  });

  it("maps the whole [0, 1) range onto the elements", () => {
    const items = ["a", "b", "c"];
    expect(pickRandom(items, () => 0)).toBe("a");
    expect(pickRandom(items, () => 0.5)).toBe("b");
    expect(pickRandom(items, () => 0.999_999)).toBe("c");
  });

  it("always returns an element of the array", () => {
    const items = [1, 2, 3, 4];
    for (let i = 0; i < 100; i++) {
      expect(items).toContain(pickRandom(items));
    }
  });
});
