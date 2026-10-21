import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { formatRelativeTime } from "./formatRelativeTime.js";

describe("formatRelativeTime", () => {
  const base = new Date("2026-03-14T12:00:00.000Z");

  it("formats a past time in the largest fitting unit", () => {
    expect(formatRelativeTime(new Date(base.getTime() - 3_600_000), base)).toBe(
      "1 hour ago",
    );
  });

  it("formats a future time", () => {
    expect(
      formatRelativeTime(new Date(base.getTime() + 2 * 86_400_000), base),
    ).toBe("in 2 days");
  });

  it("falls back to seconds for sub-minute differences", () => {
    expect(formatRelativeTime(new Date(base.getTime() - 30_000), base)).toBe(
      "30 seconds ago",
    );
  });

  it("defaults baseDate to now when omitted", () => {
    expect(formatRelativeTime(new Date())).toMatch(/now|second/);
  });

  describe("without Intl.RelativeTimeFormat (Hermes)", () => {
    beforeEach(() => {
      vi.stubGlobal(
        "Intl",
        Object.create(Intl, { RelativeTimeFormat: { value: undefined } }),
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    const at = (offsetMs: number) => new Date(base.getTime() + offsetMs);

    it("formats in English", () => {
      expect(formatRelativeTime(at(-3_600_000), base)).toBe("1 hour ago");
      expect(formatRelativeTime(at(2 * 86_400_000), base)).toBe("in 2 days");
      expect(formatRelativeTime(at(-86_400_000), base)).toBe("yesterday");
      expect(formatRelativeTime(at(-200), base)).toBe("now");
    });

    it("formats in French", () => {
      expect(formatRelativeTime(at(-3_600_000), base, "fr")).toBe(
        "il y a 1 heure",
      );
      expect(formatRelativeTime(at(3 * 7 * 86_400_000), base, "fr-FR")).toBe(
        "dans 3 semaines",
      );
      expect(formatRelativeTime(at(86_400_000), base, "fr")).toBe("demain");
      expect(formatRelativeTime(at(0), base, "fr")).toBe("maintenant");
    });

    it("falls back to English for other locales", () => {
      expect(formatRelativeTime(at(-120_000), base, "de")).toBe(
        "2 minutes ago",
      );
    });
  });
});
