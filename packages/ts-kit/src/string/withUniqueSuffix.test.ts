import { describe, expect, it } from "vitest";

import { withUniqueSuffix } from "./withUniqueSuffix.js";

describe("withUniqueSuffix", () => {
  it("keeps the base when it is free", () => {
    expect(withUniqueSuffix("solo-leveling", ["other"])).toBe("solo-leveling");
  });

  it("appends -2 when the base is taken", () => {
    expect(withUniqueSuffix("solo-leveling", ["solo-leveling"])).toBe(
      "solo-leveling-2",
    );
  });

  it("skips the numbers already taken", () => {
    expect(withUniqueSuffix("a", new Set(["a", "a-2", "a-3"]))).toBe("a-4");
  });

  it("fills the first gap", () => {
    expect(withUniqueSuffix("a", ["a", "a-3"])).toBe("a-2");
  });

  it("accepts a custom separator and start", () => {
    expect(
      withUniqueSuffix("photo", ["photo", "photo_1"], {
        separator: "_",
        start: 1,
      }),
    ).toBe("photo_2");
  });
});
