import { BackupCryptoError } from "@forthtilliath/backup-crypto";

import { DriveError } from "./googleDrive.js";

/**
 * Every failure this package can report, as a code the UI turns into a
 * localized message (see `@forthtilliath/expo-backup-ui`):
 * - `google-unavailable`: the binary was built without Google Sign-In.
 * - `play-services-unavailable`, `oauth-misconfigured` (no Android OAuth
 *   client for this package name + signing SHA-1), `sign-in-failed`,
 *   `reconnect-required` (access revoked or expired: Drive rejects even a
 *   fresh token).
 * - `drive-storage-full` (the account's Google storage is full: reading
 *   still works, writing doesn't), `drive-rate-limited`,
 *   `drive-blocked-by-admin` (work or school account), `drive-api-disabled`,
 *   `drive-permission-missing`, `drive-access-denied` (any other refusal),
 *   `drive-unavailable`, `network`.
 * - `cloud-erase-blocked`: this device holds nothing (`isEmpty`) while the
 *   cloud backup still has data — the upload was refused rather than wipe
 *   it, and every upload stays refused until the user restores the cloud
 *   backup or confirms the erase (`confirmCloudErase`).
 * - `missing-key`: an encrypted backup from a key this device doesn't have —
 *   enter the recovery code of the device that wrote it.
 * - `invalid-recovery-code` (typo), `recovery-code-mismatch` (valid code,
 *   but of another key than the file's), `corrupted`, `newer-format`.
 * - `no-safety-backup`: nothing to undo.
 * - `sharing-unavailable`: no share sheet to hand the exported file to.
 * - `file-too-large`: the picked file exceeds `maxFileBytes` (not read).
 */
export type BackupErrorCode =
  | "google-unavailable"
  | "play-services-unavailable"
  | "oauth-misconfigured"
  | "sign-in-failed"
  | "reconnect-required"
  | "drive-storage-full"
  | "drive-rate-limited"
  | "drive-blocked-by-admin"
  | "drive-api-disabled"
  | "drive-permission-missing"
  | "drive-access-denied"
  | "drive-unavailable"
  | "network"
  | "cloud-erase-blocked"
  | "missing-key"
  | "invalid-recovery-code"
  | "recovery-code-mismatch"
  | "corrupted"
  | "newer-format"
  | "no-safety-backup"
  | "sharing-unavailable"
  | "file-too-large"
  | "unknown";

export class BackupError extends Error {
  readonly code: BackupErrorCode;

  constructor(code: BackupErrorCode, options?: { cause?: unknown }) {
    super(code, options);
    this.name = "BackupError";
    this.code = code;
  }
}

const CRYPTO_CODES: Record<BackupCryptoError["code"], BackupErrorCode> = {
  "not-encrypted": "corrupted",
  "unsupported-version": "newer-format",
  "unknown-key": "missing-key",
  corrupted: "corrupted",
  "invalid-recovery-code": "invalid-recovery-code",
  "no-random-source": "unknown",
};

// Reasons Google gives with a 403 or 429 (Drive v3 "Resolve errors" guide).
const DRIVE_REASON_CODES: Partial<Record<string, BackupErrorCode>> = {
  storageQuotaExceeded: "drive-storage-full",
  userRateLimitExceeded: "drive-rate-limited",
  rateLimitExceeded: "drive-rate-limited",
  dailyLimitExceeded: "drive-rate-limited",
  sharingRateLimitExceeded: "drive-rate-limited",
  domainPolicy: "drive-blocked-by-admin",
  accessNotConfigured: "drive-api-disabled",
  insufficientPermissions: "drive-permission-missing",
};

function driveCode(error: DriveError): BackupErrorCode {
  const byReason = error.reason ? DRIVE_REASON_CODES[error.reason] : undefined;
  if (byReason) return byReason;
  if (error.status === 429) return "drive-rate-limited";
  // Only seen after the retry with a fresh token (see withToken in cloudSync).
  if (error.status === 401) return "reconnect-required";
  if (error.status === 403) return "drive-access-denied";
  return "drive-unavailable";
}

/**
 * Turns this package's (and its dependencies') errors into a
 * {@link BackupError}. Anything else — typically the app's own validation
 * error from `parse`, whose message is already meant for the user — is
 * returned untouched.
 */
export function normalizeBackupError(error: unknown): unknown {
  if (error instanceof BackupError) return error;
  if (error instanceof BackupCryptoError) {
    return new BackupError(CRYPTO_CODES[error.code], { cause: error });
  }
  if (error instanceof DriveError)
    return new BackupError(driveCode(error), { cause: error });
  // fetch() rejects with a TypeError when offline.
  if (error instanceof TypeError)
    return new BackupError("network", { cause: error });
  return error;
}

/** Code to remember for a failed background sync, whatever the error. */
export function backupErrorCode(error: unknown): BackupErrorCode {
  const normalized = normalizeBackupError(error);
  return normalized instanceof BackupError ? normalized.code : "unknown";
}

const MAX_DETAIL_LENGTH = 160;

/**
 * Short technical cause to show under the message ("HTTP 403 ·
 * storageQuotaExceeded"), so a user can report what actually failed. Only
 * for Drive and unexpected errors: the other codes already say it all.
 */
export function backupErrorDetail(error: unknown): string | null {
  const normalized = normalizeBackupError(error);
  const cause =
    normalized instanceof BackupError ? normalized.cause : normalized;
  if (cause instanceof DriveError) {
    return `HTTP ${cause.status.toString()}${cause.reason ? ` · ${cause.reason}` : ""}`;
  }
  if (normalized instanceof BackupError && normalized.code !== "unknown")
    return null;
  if (cause instanceof Error && cause.message)
    return cause.message.slice(0, MAX_DETAIL_LENGTH);
  return null;
}
