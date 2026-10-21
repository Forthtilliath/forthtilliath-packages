import { describe, expect, it } from "vitest";

import { escapeCsvField } from "./escapeCsvField.js";
import { neutralizeCsvFormula } from "./neutralizeCsvFormula.js";
import { toCsv } from "./toCsv.js";

describe("neutralizeCsvFormula", () => {
  it("prefixes cells a spreadsheet would run as formulas", () => {
    expect(neutralizeCsvFormula('=HYPERLINK("http://x","clic")')).toBe(
      `'=HYPERLINK("http://x","clic")`,
    );
    expect(neutralizeCsvFormula("+1+cmd")).toBe("'+1+cmd");
    expect(neutralizeCsvFormula("-2+3")).toBe("'-2+3");
    expect(neutralizeCsvFormula("@SUM(A1:A2)")).toBe("'@SUM(A1:A2)");
    expect(neutralizeCsvFormula("\t=1")).toBe("'\t=1");
    expect(neutralizeCsvFormula("\r=1")).toBe("'\r=1");
  });

  it("leaves numbers written as text untouched", () => {
    for (const n of ["-3", "+3", "-1,5", "-0.25", "+33612345678", "-2e-3"]) {
      expect(neutralizeCsvFormula(n)).toBe(n);
    }
  });

  it("leaves ordinary text untouched", () => {
    expect(neutralizeCsvFormula("Ann")).toBe("Ann");
    expect(neutralizeCsvFormula("a=b")).toBe("a=b");
    expect(neutralizeCsvFormula("")).toBe("");
  });
});

describe("formula injection in escapeCsvField and toCsv", () => {
  it("is neutralized by default", () => {
    expect(escapeCsvField("=1+1")).toBe("'=1+1");
    expect(escapeCsvField('=A1&";"', ";")).toBe(`"'=A1&"";"""`);
    expect(toCsv([["=1+1", "-3", -3]])).toBe(`"'=1+1","-3","-3"`);
  });

  it("can be turned off", () => {
    expect(escapeCsvField("=1+1", ";", { neutralizeFormulas: false })).toBe(
      "=1+1",
    );
    expect(toCsv([["=1+1"]], ",", { neutralizeFormulas: false })).toBe(
      '"=1+1"',
    );
  });
});
