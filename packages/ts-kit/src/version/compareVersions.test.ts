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

  it("compares segments numerically, not alphabetically", () => {
    expect(compareVersions("1.10.0", "1.2.0")).toBe(1);
  });

  it("ranks a pre-release below its release, in both directions", () => {
    expect(compareVersions("1.2.0-beta", "1.2.0")).toBe(-1);
    expect(compareVersions("1.2.0", "1.2.0-beta")).toBe(1);
  });

  it("still compares the x.y.z core before pre-release identifiers", () => {
    expect(compareVersions("1.3.0-beta", "1.2.0")).toBe(1);
  });

  it("compares numeric pre-release identifiers numerically", () => {
    expect(compareVersions("1.0.0-beta.2", "1.0.0-beta.10")).toBe(-1);
    expect(compareVersions("1.0.0-beta.10", "1.0.0-beta.2")).toBe(1);
  });

  it("follows semver pre-release precedence", () => {
    const ordered = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
    ];
    for (let i = 0; i < ordered.length - 1; i++) {
      const lower = ordered[i] ?? "";
      const higher = ordered[i + 1] ?? "";
      expect(compareVersions(lower, higher)).toBe(-1);
      expect(compareVersions(higher, lower)).toBe(1);
    }
  });

  it("detects equal pre-releases", () => {
    expect(compareVersions("1.0.0-rc.1", "1.0.0-rc.1")).toBe(0);
  });

  it("ignores a leading v and build metadata", () => {
    expect(compareVersions("v1.2.3", "1.2.3")).toBe(0);
    expect(compareVersions("1.2.3+build.5", "1.2.3+build.9")).toBe(0);
  });
});
