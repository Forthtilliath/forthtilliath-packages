import { describe, expect, it } from "vitest";

import { slugify } from "./slugify.js";

describe("slugify", () => {
  it("lower-cases and hyphenates a normal sentence", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips accents", () => {
    expect(slugify("Héllo, Wôrld!")).toBe("hello-world");
  });

  it("collapses runs of non-alphanumeric characters into one hyphen", () => {
    expect(slugify("  Multiple   spaces  ")).toBe("multiple-spaces");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--Already-slugged--")).toBe("already-slugged");
  });
});
