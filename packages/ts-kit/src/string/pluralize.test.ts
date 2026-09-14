import { describe, expect, it } from "vitest";

import { pluralize } from "./pluralize.js";

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
  });
});
