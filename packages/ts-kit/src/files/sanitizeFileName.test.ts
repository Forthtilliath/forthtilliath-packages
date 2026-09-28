import { describe, expect, it } from "vitest";

import { sanitizeFileName } from "./sanitizeFileName.js";

describe("sanitizeFileName", () => {
  it("replaces forbidden characters with hyphens", () => {
    expect(sanitizeFileName("AC/DC: Live?")).toBe("AC-DC- Live-");
    expect(sanitizeFileName('a\\b*c"d<e>f|g')).toBe("a-b-c-d-e-f-g");
  });

  it("keeps accents and apostrophes", () => {
    expect(sanitizeFileName("Rêver j'en ai l'habitude")).toBe(
      "Rêver j'en ai l'habitude",
    );
  });

  it("collapses whitespace runs and trims", () => {
    expect(sanitizeFileName("  My   file\t2026 ")).toBe("My file 2026");
  });
});
