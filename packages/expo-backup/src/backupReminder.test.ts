import { describe, expect, it } from "vitest";

import {
  getUnsavedDates,
  shouldShowBackupReminder,
  snoozeBackupReminder,
} from "./backupReminder.js";

const DAY = 24 * 60 * 60 * 1000;
const now = 100 * DAY;

describe("getUnsavedDates", () => {
  it("keeps the items changed after the last backup, all if none", () => {
    expect(getUnsavedDates([1, 5, 9], 5)).toEqual([9]);
    expect(getUnsavedDates([1, 5, 9], null)).toEqual([1, 5, 9]);
  });
});

describe("shouldShowBackupReminder", () => {
  const base = { lastBackupAt: null, snoozedUntil: null, now };

  it("stays quiet with nothing unsaved", () => {
    expect(shouldShowBackupReminder({ ...base, itemDates: [] })).toBe(false);
    expect(
      shouldShowBackupReminder({
        ...base,
        itemDates: [now - 30 * DAY],
        lastBackupAt: now - DAY,
      }),
    ).toBe(false);
  });

  it("handles a very long history without overflowing the stack", () => {
    const itemDates = Array.from({ length: 200_000 }, () => now - DAY);
    expect(() =>
      shouldShowBackupReminder({ ...base, itemDates, afterCount: Infinity }),
    ).not.toThrow();
  });

  it("reminds once the oldest unsaved item is old enough", () => {
    expect(
      shouldShowBackupReminder({ ...base, itemDates: [now - 6 * DAY] }),
    ).toBe(false);
    expect(
      shouldShowBackupReminder({ ...base, itemDates: [now - 7 * DAY] }),
    ).toBe(true);
    expect(
      shouldShowBackupReminder({
        ...base,
        itemDates: [now - 2 * DAY],
        afterDays: 2,
      }),
    ).toBe(true);
  });

  it("reminds when unsaved items pile up, however recent", () => {
    const recent = [1, 2, 3, 4].map((h) => now - h * 3_600_000);
    expect(shouldShowBackupReminder({ ...base, itemDates: recent })).toBe(
      false,
    );
    expect(
      shouldShowBackupReminder({ ...base, itemDates: [...recent, now] }),
    ).toBe(true);
    expect(
      shouldShowBackupReminder({ ...base, itemDates: recent, afterCount: 4 }),
    ).toBe(true);
  });

  it("stays quiet while snoozed, then reminds again", () => {
    const itemDates = [now - 30 * DAY];
    const snoozedUntil = snoozeBackupReminder(now);
    expect(snoozedUntil).toBe(now + 7 * DAY);
    expect(shouldShowBackupReminder({ ...base, itemDates, snoozedUntil })).toBe(
      false,
    );
    expect(
      shouldShowBackupReminder({
        ...base,
        itemDates,
        snoozedUntil,
        now: snoozedUntil,
      }),
    ).toBe(true);
  });

  it("defaults now to the current time", () => {
    expect(
      shouldShowBackupReminder({
        itemDates: [Date.now() - 8 * DAY],
        lastBackupAt: null,
        snoozedUntil: null,
      }),
    ).toBe(true);
    expect(snoozeBackupReminder(undefined, 1)).toBeGreaterThan(Date.now());
  });
});
