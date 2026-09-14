import { describe, expect, it } from "vitest";

import { isUpdateAvailable } from "./isUpdateAvailable.js";

describe("isUpdateAvailable", () => {
  it("returns true when the latest version is newer", () => {
    expect(isUpdateAvailable("1.2.0", "1.10.0")).toBe(true);
  });

  it("returns false when the versions are equal", () => {
    expect(isUpdateAvailable("1.2.3", "1.2.3")).toBe(false);
  });

  it("returns false when the latest version is older", () => {
    expect(isUpdateAvailable("2.0.0", "1.9.9")).toBe(false);
  });
});
