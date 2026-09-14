import { describe, expect, it } from "vitest";

import { formatBytes } from "./formatBytes.js";

describe("formatBytes", () => {
  it("formats 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes below 1024 as-is", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes, dropping trailing zeros", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1024)).toBe("1 KB");
  });

  it("formats megabytes and gigabytes", () => {
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1024 * 1024 * 1024 * 2.5)).toBe("2.5 GB");
  });

  it("respects a custom decimals count", () => {
    expect(formatBytes(1234, 0)).toBe("1 KB");
    expect(formatBytes(1234, 3)).toBe("1.205 KB");
  });
});
