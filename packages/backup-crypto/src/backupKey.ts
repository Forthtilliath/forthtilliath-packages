import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import { base64, hex } from "@scure/base";

import { BackupCryptoError } from "./errors.js";

/** Length in bytes of a backup key (XChaCha20-Poly1305 uses 256-bit keys). */
export const BACKUP_KEY_LENGTH = 32;

/** Fills a new array with `length` cryptographically secure random bytes. */
export type RandomBytes = (length: number) => Uint8Array;

const KEY_ID_DOMAIN = utf8ToBytes("forthtilliath.backup-key-id");

/**
 * The random source used when no `randomBytes` option is given:
 * `crypto.getRandomValues` (browsers, Node, React Native with `expo-crypto`'s
 * polyfill). Throws rather than ever falling back to `Math.random`.
 */
export function defaultRandomBytes(length: number): Uint8Array {
  const webCrypto = (globalThis as { crypto?: Partial<Crypto> }).crypto;
  if (typeof webCrypto?.getRandomValues !== "function") {
    throw new BackupCryptoError(
      "no-random-source",
      "No secure random source: pass a `randomBytes` option (e.g. expo-crypto's getRandomBytes).",
    );
  }
  return webCrypto.getRandomValues(new Uint8Array(length));
}

/** Generates a new random 256-bit backup key. */
export function generateBackupKey(
  randomBytes: RandomBytes = defaultRandomBytes,
): Uint8Array {
  const key = randomBytes(BACKUP_KEY_LENGTH);
  if (key.length !== BACKUP_KEY_LENGTH) {
    throw new BackupCryptoError(
      "no-random-source",
      `randomBytes returned ${key.length} bytes instead of ${BACKUP_KEY_LENGTH}.`,
    );
  }
  return key;
}

/**
 * A short, stable, non-secret identifier of a key (16 hex chars), stored next
 * to each encrypted backup so the right key can be picked from a keyring.
 * Domain-separated hash: it reveals nothing usable about the key itself.
 */
export function getBackupKeyId(key: Uint8Array): string {
  const input = new Uint8Array(KEY_ID_DOMAIN.length + key.length);
  input.set(KEY_ID_DOMAIN);
  input.set(key, KEY_ID_DOMAIN.length);
  return hex.encode(sha256(input).subarray(0, 8));
}

/** Base64 form of a key, for storage (secure store, keyring file). */
export function encodeBackupKey(key: Uint8Array): string {
  return base64.encode(key);
}

/** Reverse of {@link encodeBackupKey}. Throws `corrupted` on anything else than a 256-bit key. */
export function decodeBackupKey(encoded: string): Uint8Array {
  let key: Uint8Array;
  try {
    key = base64.decode(encoded);
  } catch {
    throw new BackupCryptoError("corrupted", "Invalid backup key encoding.");
  }
  if (key.length !== BACKUP_KEY_LENGTH) {
    throw new BackupCryptoError("corrupted", "Invalid backup key length.");
  }
  return key;
}
