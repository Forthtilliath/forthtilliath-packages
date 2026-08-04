import { describe, expect, it } from "vitest";

import { formatCsvNumber } from "./formatCsvNumber.js";

describe("formatCsvNumber", () => {
  it("utilise une décimale par défaut", () => {
    expect(formatCsvNumber(12.345)).toBe("12,3");
  });

  it("remplace le point par une virgule", () => {
    expect(formatCsvNumber(1.5)).toBe("1,5");
  });

  it("respecte le nombre de décimales fourni", () => {
    expect(formatCsvNumber(12.345, 0)).toBe("12");
    expect(formatCsvNumber(12.345, 2)).toBe("12,35");
  });
});
