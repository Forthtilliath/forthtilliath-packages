/**
 * Why a backup couldn't be encrypted or decrypted:
 * - `not-encrypted`: the content isn't an encrypted backup at all (e.g. a
 *   plain JSON export) — callers usually fall back to reading it as is.
 * - `unsupported-version`: written by a newer version of this package.
 * - `unknown-key`: encrypted with a key that isn't in the keyring — ask for
 *   the recovery code of the device that wrote it.
 * - `corrupted`: malformed, truncated or tampered with (authentication failed).
 * - `invalid-recovery-code`: a typo in a recovery code (checksum mismatch).
 * - `no-random-source`: no `crypto.getRandomValues` and no `randomBytes`
 *   option — never encrypt with a weak random source instead.
 */
export type BackupCryptoErrorCode =
  | "not-encrypted"
  | "unsupported-version"
  | "unknown-key"
  | "corrupted"
  | "invalid-recovery-code"
  | "no-random-source";

export class BackupCryptoError extends Error {
  readonly code: BackupCryptoErrorCode;

  constructor(code: BackupCryptoErrorCode, message?: string) {
    super(message ?? code);
    this.name = "BackupCryptoError";
    this.code = code;
  }
}
