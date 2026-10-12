import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { bytesToUtf8, utf8ToBytes } from "@noble/ciphers/utils.js";
import { base64 } from "@scure/base";

import {
  BACKUP_KEY_LENGTH,
  defaultRandomBytes,
  getBackupKeyId,
  type RandomBytes,
} from "./backupKey.js";
import { BackupCryptoError } from "./errors.js";

export const ENCRYPTED_BACKUP_FORMAT = "forthtilliath.encrypted-backup";
export const ENCRYPTED_BACKUP_VERSION = 1;
const CIPHER = "xchacha20-poly1305";
const NONCE_LENGTH = 24;

/**
 * What an encrypted backup file contains. Still JSON (so pickers filtering on
 * `application/json` keep working), but only the header is readable: the
 * app's data is in `ciphertext`.
 */
export interface EncryptedBackupEnvelope {
  format: typeof ENCRYPTED_BACKUP_FORMAT;
  version: number;
  /** Free label of the app that wrote it — authenticated, not secret. */
  app: string;
  /** {@link getBackupKeyId} of the key it was encrypted with. */
  keyId: string;
  cipher: typeof CIPHER;
  nonce: string;
  ciphertext: string;
}

export interface EncryptBackupOptions {
  /** Stored in clear and authenticated, e.g. `"glucodose"`. */
  app?: string;
  randomBytes?: RandomBytes;
}

// The header is bound to the ciphertext as associated data: editing the
// app/keyId/version of a file makes decryption fail instead of being trusted.
function associatedData(
  envelope: Pick<
    EncryptedBackupEnvelope,
    "format" | "version" | "app" | "keyId" | "cipher"
  >,
): Uint8Array {
  return utf8ToBytes(
    JSON.stringify([
      envelope.format,
      envelope.version,
      envelope.app,
      envelope.keyId,
      envelope.cipher,
    ]),
  );
}

function assertKey(key: Uint8Array) {
  if (key.length !== BACKUP_KEY_LENGTH) {
    throw new BackupCryptoError("corrupted", "Invalid backup key length.");
  }
}

/**
 * Encrypts a backup's text (typically the app's JSON export) with
 * XChaCha20-Poly1305 and a fresh random 192-bit nonce — safe to reuse the
 * same key for every backup. Returns the JSON envelope to write as is.
 */
export function encryptBackup(
  plaintext: string,
  key: Uint8Array,
  { app = "", randomBytes = defaultRandomBytes }: EncryptBackupOptions = {},
): string {
  assertKey(key);
  const nonce = randomBytes(NONCE_LENGTH);
  if (nonce.length !== NONCE_LENGTH) {
    throw new BackupCryptoError("no-random-source");
  }
  const header = {
    format: ENCRYPTED_BACKUP_FORMAT,
    version: ENCRYPTED_BACKUP_VERSION,
    app,
    keyId: getBackupKeyId(key),
    cipher: CIPHER,
  } as const;
  const ciphertext = xchacha20poly1305(
    key,
    nonce,
    associatedData(header),
  ).encrypt(utf8ToBytes(plaintext));
  const envelope: EncryptedBackupEnvelope = {
    ...header,
    nonce: base64.encode(nonce),
    ciphertext: base64.encode(ciphertext),
  };
  return JSON.stringify(envelope);
}

function tryParseJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Whether `content` is an encrypted backup envelope (of any version). */
export function isEncryptedBackup(content: string): boolean {
  const parsed = tryParseJson(content);
  return isRecord(parsed) && parsed.format === ENCRYPTED_BACKUP_FORMAT;
}

/**
 * Validates and returns an encrypted backup's header. Throws
 * `not-encrypted` for anything that isn't an envelope, `unsupported-version`
 * for a newer one, `corrupted` for a malformed one.
 */
export function readEncryptedBackup(content: string): EncryptedBackupEnvelope {
  const parsed = tryParseJson(content);
  if (!isRecord(parsed) || parsed.format !== ENCRYPTED_BACKUP_FORMAT) {
    throw new BackupCryptoError("not-encrypted");
  }
  if (
    typeof parsed.version !== "number" ||
    parsed.version > ENCRYPTED_BACKUP_VERSION
  ) {
    throw new BackupCryptoError("unsupported-version");
  }
  const { app, keyId, cipher, nonce, ciphertext } = parsed;
  if (
    typeof app !== "string" ||
    typeof keyId !== "string" ||
    cipher !== CIPHER ||
    typeof nonce !== "string" ||
    typeof ciphertext !== "string"
  ) {
    throw new BackupCryptoError("corrupted", "Malformed encrypted backup.");
  }
  return {
    format: ENCRYPTED_BACKUP_FORMAT,
    version: parsed.version,
    app,
    keyId,
    cipher,
    nonce,
    ciphertext,
  };
}

/**
 * Decrypts an envelope written by {@link encryptBackup}. Throws `unknown-key`
 * when `key` isn't the one it was encrypted with, `corrupted` when the file
 * was truncated or tampered with.
 */
export function decryptBackup(content: string, key: Uint8Array): string {
  assertKey(key);
  const envelope = readEncryptedBackup(content);
  if (envelope.keyId !== getBackupKeyId(key)) {
    throw new BackupCryptoError("unknown-key");
  }
  try {
    const nonce = base64.decode(envelope.nonce);
    const ciphertext = base64.decode(envelope.ciphertext);
    const plaintext = xchacha20poly1305(
      key,
      nonce,
      associatedData(envelope),
    ).decrypt(ciphertext);
    return bytesToUtf8(plaintext);
  } catch {
    throw new BackupCryptoError(
      "corrupted",
      "Encrypted backup failed authentication.",
    );
  }
}
