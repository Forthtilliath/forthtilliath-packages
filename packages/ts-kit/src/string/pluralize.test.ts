import { describe, expect, it } from "vitest";

import { createPluralize, pluralize } from "./pluralize.js";

describe("pluralize", () => {
  it("returns the singular form for a count of 1 or -1", () => {
    expect(pluralize(1, "item")).toBe("item");
    expect(pluralize(-1, "item")).toBe("item");
  });

  it("appends s by default for other counts", () => {
    expect(pluralize(0, "item")).toBe("items");
    expect(pluralize(3, "item")).toBe("items");
  });

  it("applies the y -> ies rule", () => {
    expect(pluralize(3, "city")).toBe("cities");
  });

  it("appends es after s, x, z, ch, sh", () => {
    expect(pluralize(2, "bus")).toBe("buses");
    expect(pluralize(2, "box")).toBe("boxes");
    expect(pluralize(2, "buzz")).toBe("buzzes");
    expect(pluralize(2, "match")).toBe("matches");
    expect(pluralize(2, "dish")).toBe("dishes");
  });

  it("uses the explicit plural form when provided", () => {
    expect(pluralize(2, "child", "children")).toBe("children");
    expect(pluralize(2, "child", { plural: "children" })).toBe("children");
  });

  describe("with a locale", () => {
    it("keeps the singular for 0 and below 2 in French", () => {
      expect(pluralize(0, "chant", { locale: "fr" })).toBe("chant");
      expect(pluralize(1, "chant", { locale: "fr" })).toBe("chant");
      expect(pluralize(1.5, "litre", { locale: "fr-FR" })).toBe("litre");
      expect(pluralize(2, "chant", { locale: "fr" })).toBe("chants");
    });

    it("takes the plural for large counts in French (CLDR 'many')", () => {
      expect(pluralize(1_000_000, "chant", { locale: "fr" })).toBe("chants");
    });

    it("leaves French words ending in s, x or z unchanged", () => {
      expect(pluralize(2, "mois", { locale: "fr" })).toBe("mois");
      expect(pluralize(2, "prix", { locale: "fr" })).toBe("prix");
      expect(pluralize(2, "nez", { locale: "fr" })).toBe("nez");
    });

    it("uses the explicit plural form in French", () => {
      expect(
        pluralize(2, "journal", { plural: "journaux", locale: "fr" }),
      ).toBe("journaux");
    });

    it("appends s in other languages", () => {
      expect(pluralize(0, "Auto", { locale: "de" })).toBe("Autos");
      expect(pluralize(1, "Auto", { locale: "de" })).toBe("Auto");
    });
  });
});

describe("createPluralize", () => {
  it("binds the locale", () => {
    const plural = createPluralize("fr");
    expect(plural(0, "chant")).toBe("chant");
    expect(plural(3, "chant")).toBe("chants");
    expect(plural(2, "est", "sont")).toBe("sont");
  });
});
