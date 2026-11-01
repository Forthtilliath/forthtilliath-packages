import { describe, expect, it } from "vitest";

import { escapeRegExp } from "./escapeRegExp.js";

describe("escapeRegExp", () => {
  it("leaves plain text unchanged", () => {
    expect(escapeRegExp("solo-leveling")).toBe("solo-leveling");
  });

  it("escapes every special character", () => {
    expect(escapeRegExp(".*+?^${}()|[]\\")).toBe(
      "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\",
    );
  });

  it("makes a built pattern match the text literally", () => {
    const value = "a.b (2)";
    const pattern = new RegExp(`^${escapeRegExp(value)}$`);

    expect(pattern.test(value)).toBe(true);
    expect(pattern.test("aXb (2)")).toBe(false);
  });
});
