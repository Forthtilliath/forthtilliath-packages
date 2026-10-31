import { describe, expect, it } from "vitest";

import { parseIntegerInput } from "./parseIntegerInput.js";
import { sanitizeIntegerInput } from "./sanitizeIntegerInput.js";

describe("sanitizeIntegerInput", () => {
  it("keeps digits only", () => {
    expect(sanitizeIntegerInput("1 250,5 pts")).toBe("12505");
  });

  it("keeps a leading minus, even alone", () => {
    expect(sanitizeIntegerInput("-")).toBe("-");
    expect(sanitizeIntegerInput("-30")).toBe("-30");
    expect(sanitizeIntegerInput("  -3")).toBe("-3");
  });

  it("drops a minus anywhere else", () => {
    expect(sanitizeIntegerInput("12-3")).toBe("123");
    expect(sanitizeIntegerInput("--5")).toBe("-5");
  });

  it("drops every minus when negatives are not allowed", () => {
    expect(sanitizeIntegerInput("-4", { allowNegative: false })).toBe("4");
  });
});

describe("parseIntegerInput", () => {
  it("parses whole numbers, negative included", () => {
    expect(parseIntegerInput("42")).toBe(42);
    expect(parseIntegerInput("-12")).toBe(-12);
    expect(parseIntegerInput("007")).toBe(7);
  });

  it("returns null while the text isn't a number yet", () => {
    for (const raw of ["", "-", "1-2", "1.5", " 3", "abc"]) {
      expect(parseIntegerInput(raw)).toBeNull();
    }
  });

  it("returns null beyond the safe integer range", () => {
    expect(parseIntegerInput("99999999999999999999")).toBeNull();
    expect(parseIntegerInput(String(Number.MAX_SAFE_INTEGER))).toBe(
      Number.MAX_SAFE_INTEGER,
    );
  });

  it("never returns a negative zero", () => {
    expect(Object.is(parseIntegerInput("-0"), 0)).toBe(true);
  });
});
