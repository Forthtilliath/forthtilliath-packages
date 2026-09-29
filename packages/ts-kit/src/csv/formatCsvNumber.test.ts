import { describe, expect, it } from "vitest";

import { formatCsvNumber } from "./formatCsvNumber.js";

describe("formatCsvNumber", () => {
  it("defaults to one decimal", () => {
    expect(formatCsvNumber(12.345)).toBe("12,3");
  });

  it("replaces the dot with a comma", () => {
    expect(formatCsvNumber(1.5)).toBe("1,5");
  });

  it("honors the given number of decimals", () => {
    expect(formatCsvNumber(12.345, 0)).toBe("12");
    expect(formatCsvNumber(12.345, 2)).toBe("12,35");
  });
});
