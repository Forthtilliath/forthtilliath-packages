import { describe, expect, it } from "vitest";

import { normalizeForSearch } from "./normalizeForSearch.js";

describe("normalizeForSearch", () => {
  it("lower-cases and strips accents", () => {
    expect(normalizeForSearch("Pâtes À La Crème")).toBe("pates a la creme");
  });

  it("trims leading/trailing whitespace", () => {
    expect(normalizeForSearch("  Apple  ")).toBe("apple");
  });

  it("expands œ/æ ligatures", () => {
    expect(normalizeForSearch("Œuf")).toBe("oeuf");
    expect(normalizeForSearch("œuf")).toBe("oeuf");
    expect(normalizeForSearch("Bœuf")).toBe("boeuf");
    expect(normalizeForSearch("nævus")).toBe("naevus");
  });
});
