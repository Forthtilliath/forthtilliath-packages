import { describe, expect, it, vi } from "vitest";

import { shuffle } from "./shuffle.js";

describe("shuffle", () => {
  it("keeps every element exactly once", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    expect([...shuffle(input)].sort((a, b) => a - b)).toEqual(input);
  });

  it("is deterministic with an injected generator", () => {
    expect(shuffle(["a", "b", "c"], () => 0)).toEqual(["b", "c", "a"]);
    expect(shuffle(["a", "b", "c"], () => 0.99)).toEqual(["a", "b", "c"]);
  });

  it("draws once per swap, from the end of the array", () => {
    const random = vi.fn(() => 0.5);
    shuffle([1, 2, 3, 4], random);
    expect(random).toHaveBeenCalledTimes(3);
  });

  it("does not mutate the original array", () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(input, () => 0);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles empty and single-element arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([1])).toEqual([1]);
  });
});
