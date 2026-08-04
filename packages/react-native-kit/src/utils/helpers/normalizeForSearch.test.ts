import { describe, expect, it } from "vitest";

import { normalizeForSearch } from "./normalizeForSearch.js";

describe("normalizeForSearch", () => {
  it("met en minuscules et retire les accents", () => {
    expect(normalizeForSearch("Pâtes À La Crème")).toBe("pates a la creme");
  });

  it("retire les espaces en début/fin", () => {
    expect(normalizeForSearch("  Pomme  ")).toBe("pomme");
  });

  it("développe les ligatures œ/æ", () => {
    expect(normalizeForSearch("Œuf")).toBe("oeuf");
    expect(normalizeForSearch("œuf")).toBe("oeuf");
    expect(normalizeForSearch("Bœuf")).toBe("boeuf");
    expect(normalizeForSearch("nævus")).toBe("naevus");
  });
});
