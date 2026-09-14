import { describe, expect, it } from "vitest";

import { truncate } from "./truncate.js";

describe("truncate", () => {
  it("truncates and appends the default suffix when the string is too long", () => {
    expect(truncate("Hello world", 8)).toBe("Hello w…");
  });

  it("returns the string unchanged when it already fits", () => {
    expect(truncate("Hi", 8)).toBe("Hi");
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("supports a custom suffix", () => {
    expect(truncate("Hello world", 8, "...")).toBe("Hello...");
  });

  it("never returns a string longer than maxLength", () => {
    expect(truncate("Hello world", 3).length).toBeLessThanOrEqual(3);
  });
});
