import { describe, expect, it } from "vitest";

import { capitalize } from "./capitalize.js";

describe("capitalize", () => {
  it("uppercases the first letter and lowercases the rest", () => {
    expect(capitalize("hello world")).toBe("Hello world");
    expect(capitalize("HELLO")).toBe("Hello");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });

  it("leaves an already-capitalized single letter unchanged", () => {
    expect(capitalize("a")).toBe("A");
  });
});
