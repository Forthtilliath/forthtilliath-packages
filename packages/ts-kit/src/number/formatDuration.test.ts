import { describe, expect, it } from "vitest";

import { formatDuration } from "./formatDuration.js";

describe("formatDuration", () => {
  it("formats sub-second durations in milliseconds", () => {
    expect(formatDuration(500)).toBe("500ms");
    expect(formatDuration(0)).toBe("0ms");
  });

  it("formats seconds only", () => {
    expect(formatDuration(45_000)).toBe("45s");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(90_000)).toBe("1m 30s");
  });

  it("omits zero-value units in the middle", () => {
    expect(formatDuration(3_600_000)).toBe("1h");
  });

  it("formats days, hours, minutes and seconds together", () => {
    expect(formatDuration(90_061_000)).toBe("1d 1h 1m 1s");
  });
});
