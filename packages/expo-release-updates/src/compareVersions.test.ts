import { describe, expect, it } from "vitest";

import { compareVersions } from "./compareVersions.js";

describe("compareVersions", () => {
  it("detects a newer version", () => {
    expect(compareVersions("1.1.0", "1.0.0")).toBe(1);
  });

  it("detects an older version", () => {
    expect(compareVersions("1.0.0", "1.1.0")).toBe(-1);
  });

  it("detects equal versions", () => {
    expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
  });

  it("compares segments of different lengths correctly", () => {
    expect(compareVersions("1.2", "1.2.1")).toBe(-1);
    expect(compareVersions("2.0.0", "1.9.9")).toBe(1);
  });
});
