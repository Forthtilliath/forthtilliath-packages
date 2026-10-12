// When to nudge the user to back up: data that only lives on this phone is
// lost with it. Pure functions over epoch-ms dates, so the rule doesn't care
// what the app stores (games, weighings, scans…) — pass each item's date.

const DAY_MS = 24 * 60 * 60 * 1000;

export interface BackupReminderRule {
  /** Remind once the oldest unsaved item is this old. @defaultValue 7 */
  afterDays?: number;
  /** Remind as soon as this many items are unsaved, however recent. @defaultValue 5 */
  afterCount?: number;
}

export interface BackupReminderInput extends BackupReminderRule {
  /** Date (epoch ms) of each item: creation, or last change if items can be edited. */
  itemDates: readonly number[];
  /** Last successful backup (file or cloud), `null` if never. */
  lastBackupAt: number | null;
  /** End of a "Later" snooze (see {@link snoozeBackupReminder}), `null` if none. */
  snoozedUntil: number | null;
  /** @defaultValue Date.now() */
  now?: number;
}

/** Dates of the items changed after the last backup — all of them if there was none. */
export function getUnsavedDates(
  itemDates: readonly number[],
  lastBackupAt: number | null,
): number[] {
  return itemDates.filter((date) => date > (lastBackupAt ?? 0));
}

/**
 * Whether to show the backup reminder: unsaved items have been at risk for
 * long enough, or are piling up. Independent of automatic backups: while they
 * work, `lastBackupAt` follows every change and the reminder never shows;
 * when they fail (offline, access revoked…), it takes over.
 *
 * @example
 * shouldShowBackupReminder({
 *   itemDates: games.map((g) => g.finishedAt ?? g.createdAt),
 *   lastBackupAt,
 *   snoozedUntil,
 * });
 */
export function shouldShowBackupReminder({
  itemDates,
  lastBackupAt,
  snoozedUntil,
  now = Date.now(),
  afterDays = 7,
  afterCount = 5,
}: BackupReminderInput): boolean {
  if (snoozedUntil !== null && now < snoozedUntil) return false;

  const unsaved = getUnsavedDates(itemDates, lastBackupAt);
  if (unsaved.length === 0) return false;
  if (unsaved.length >= afterCount) return true;

  return now - Math.min(...unsaved) >= afterDays * DAY_MS;
}

/** End of a "Later" snooze started `now`, to store as `snoozedUntil`. */
export function snoozeBackupReminder(now = Date.now(), days = 7): number {
  return now + days * DAY_MS;
}
