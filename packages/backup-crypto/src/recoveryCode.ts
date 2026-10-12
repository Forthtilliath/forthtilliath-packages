import { sha256 } from "@noble/hashes/sha2.js";
import { base32crockford } from "@scure/base";

import { BACKUP_KEY_LENGTH } from "./backupKey.js";
import { BackupCryptoError } from "./errors.js";

const CHECKSUM_LENGTH = 2;
const GROUP_SIZE = 5;

function checksum(key: Uint8Array): Uint8Array {
  return sha256(key).subarray(0, CHECKSUM_LENGTH);
}

/**
 * Human-friendly form of a key, to write down or store in a password manager:
 * Crockford base32 (no I/L/O/U, case-insensitive) in dash-separated groups of
 * 5, with a 16-bit checksum so a typo is reported as such instead of silently
 * yielding a different key. 55 characters, e.g. `7K3QD-…-XW0`.
 */
export function formatRecoveryCode(key: Uint8Array): string {
  const payload = new Uint8Array(BACKUP_KEY_LENGTH + CHECKSUM_LENGTH);
  payload.set(key);
  payload.set(checksum(key), BACKUP_KEY_LENGTH);
  const code = base32crockford.encode(payload);
  const groups: string[] = [];
  for (let i = 0; i < code.length; i += GROUP_SIZE) {
    groups.push(code.slice(i, i + GROUP_SIZE));
  }
  return groups.join("-");
}

/**
 * Reverse of {@link formatRecoveryCode}. Tolerant of what people actually
 * type: lowercase, spaces, missing or extra dashes, and I/L/O mistaken for
 * 1/1/0. Throws `invalid-recovery-code` on a wrong length or checksum.
 */
export function parseRecoveryCode(code: string): Uint8Array {
  const normalized = code.toUpperCase().replace(/[^0-9A-Z]/g, "");
  let payload: Uint8Array;
  try {
    payload = base32crockford.decode(normalized);
  } catch {
    throw new BackupCryptoError("invalid-recovery-code");
  }
  if (payload.length !== BACKUP_KEY_LENGTH + CHECKSUM_LENGTH) {
    throw new BackupCryptoError("invalid-recovery-code");
  }
  const key = payload.slice(0, BACKUP_KEY_LENGTH);
  const expected = checksum(key);
  const actual = payload.subarray(BACKUP_KEY_LENGTH);
  if (expected[0] !== actual[0] || expected[1] !== actual[1]) {
    throw new BackupCryptoError("invalid-recovery-code");
  }
  return key;
}
