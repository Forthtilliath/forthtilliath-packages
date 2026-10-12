import { BackupCryptoError } from "@forthtilliath/backup-crypto";

import { DriveError } from "./googleDrive.js";

/**
 * Every failure this package can report, as a code the UI turns into a
 * localized message (see `@forthtilliath/expo-backup-ui`):
 * - `google-unavailable`: the binary was built without Google Sign-In.
 * - `play-services-unavailable`, `oauth-misconfigured` (no Android OAuth
 *   client for this package name + signing SHA-1), `sign-in-failed`,
 *   `reconnect-required` (access revoked).
 * - `drive-api-disabled`, `drive-permission-missing`, `drive-access-denied`,
 *   `drive-unavailable`, `network`.
 * - `missing-key`: an encrypted backup from a key this device doesn't have —
 *   enter the recovery code of the device that wrote it.
 * - `invalid-recovery-code` (typo), `recovery-code-mismatch` (valid code,
 *   but of another key than the file's), `corrupted`, `newer-format`.
 * - `no-safety-backup`: nothing to undo.
 * - `sharing-unavailable`: no share sheet to hand the exported file to.
 */
export type BackupErrorCode =
  | "google-unavailable"
  | "play-services-unavailable"
  | "oauth-misconfigured"
  | "sign-in-failed"
  | "reconnect-required"
  | "drive-api-disabled"
  | "drive-permission-missing"
  | "drive-access-denied"
  | "drive-unavailable"
  | "network"
  | "missing-key"
  | "invalid-recovery-code"
  | "recovery-code-mismatch"
  | "corrupted"
  | "newer-format"
  | "no-safety-backup"
  | "sharing-unavailable"
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

function driveCode(error: DriveError): BackupErrorCode {
  if (error.reason === "accessNotConfigured") return "drive-api-disabled";
  if (error.reason === "insufficientPermissions")
    return "drive-permission-missing";
  if (error.status === 401 || error.status === 403)
    return "drive-access-denied";
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
