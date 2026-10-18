// Whether the automatic backup is failing in a way the user must hear about
// outside the backup screen (banner, alert, tab badge). Pure, so it is
// deep-importable without the native peers.

import type { BackupErrorCode } from "./errors.js";
import type { BackupState } from "./stateStore.js";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Failures that fix themselves (connection back, Drive up again): only worth
 * reporting once they last. Every other code needs the user (free up space,
 * reconnect…) and is reported at once.
 */
const TRANSIENT_CODES: ReadonlySet<BackupErrorCode> = new Set([
  "network",
  "drive-unavailable",
  "drive-rate-limited",
]);

export interface CloudBackupProblem {
  code: BackupErrorCode;
  /** Technical cause, for diagnosis (see `backupErrorDetail`). */
  detail: string | null;
  /** First failure since the last successful upload. Epoch ms. */
  since: number;
}

export interface CloudBackupProblemOptions {
  /** How long a transient failure (offline, Drive down) is tolerated. @defaultValue 1 day */
  transientGraceMs?: number;
  /** @defaultValue Date.now() */
  now?: number;
}

/**
 * The automatic backup's failure to tell the user about, or null: no account
 * linked, no failure, or a transient one still within its grace period.
 *
 * @example
 * const problem = getCloudBackupProblem(useBackupState(backup));
 * if (problem) showBanner(labels.errors[problem.code]);
 */
export function getCloudBackupProblem(
  state: Pick<
    BackupState,
    "cloudAccount" | "cloudError" | "cloudErrorDetail" | "cloudFailingSince"
  >,
  {
    transientGraceMs = DAY_MS,
    now = Date.now(),
  }: CloudBackupProblemOptions = {},
): CloudBackupProblem | null {
  const { cloudAccount, cloudError, cloudErrorDetail } = state;
  if (!cloudAccount || !cloudError) return null;
  // State saved by a version that didn't record it: count from now.
  const since = state.cloudFailingSince ?? now;
  if (TRANSIENT_CODES.has(cloudError) && now - since < transientGraceMs)
    return null;
  return { code: cloudError, detail: cloudErrorDetail, since };
}
