import {
  decodeBackupKey,
  defaultRandomBytes,
  encodeBackupKey,
  generateBackupKey,
  getBackupKeyId,
  type RandomBytes,
} from "./backupKey.js";
import { decryptBackup, readEncryptedBackup } from "./envelope.js";
import { BackupCryptoError } from "./errors.js";

export const BACKUP_KEYRING_FORMAT = "forthtilliath.backup-keyring";
const BACKUP_KEYRING_VERSION = 1;

export interface BackupKeyringEntry {
  id: string;
  key: Uint8Array;
  /** Epoch ms. */
  createdAt: number;
}

/**
 * Every key an app has encrypted backups with, so a file written before a
 * key change (another phone, a reinstall…) stays readable. New backups always
 * use `currentId`. Immutable: every helper returns a new keyring.
 */
export interface BackupKeyring {
  currentId: string | null;
  keys: readonly BackupKeyringEntry[];
}

export const emptyKeyring: BackupKeyring = { currentId: null, keys: [] };

export function findKeyringKey(
  keyring: BackupKeyring,
  id: string,
): BackupKeyringEntry | undefined {
  return keyring.keys.find((entry) => entry.id === id);
}

export function getCurrentKey(
  keyring: BackupKeyring,
): BackupKeyringEntry | undefined {
  return keyring.currentId === null
    ? undefined
    : findKeyringKey(keyring, keyring.currentId);
}

/**
 * Adds `key` (a no-op if already there). It becomes the current key when
 * `makeCurrent` is set or when the keyring had none.
 */
export function addKeyToKeyring(
  keyring: BackupKeyring,
  key: Uint8Array,
  { makeCurrent = false, createdAt = Date.now() } = {},
): BackupKeyring {
  const id = getBackupKeyId(key);
  const keys = findKeyringKey(keyring, id)
    ? keyring.keys
    : [...keyring.keys, { id, key, createdAt }];
  const currentId =
    makeCurrent || keyring.currentId === null ? id : keyring.currentId;
  return { currentId, keys };
}

/** Returns the keyring with a current key, generating one if it had none. */
export function ensureCurrentKey(
  keyring: BackupKeyring,
  randomBytes: RandomBytes = defaultRandomBytes,
): BackupKeyring {
  if (getCurrentKey(keyring)) return keyring;
  return addKeyToKeyring(keyring, generateBackupKey(randomBytes), {
    makeCurrent: true,
  });
}

/**
 * Union of two keyrings. `preferred`'s current key wins (e.g. the one already
 * on the cloud, so every device converges on it), falling back to `other`'s.
 */
export function mergeKeyrings(
  preferred: BackupKeyring,
  other: BackupKeyring,
): BackupKeyring {
  const keys = [...preferred.keys];
  for (const entry of other.keys) {
    if (!findKeyringKey(preferred, entry.id)) keys.push(entry);
  }
  return { currentId: preferred.currentId ?? other.currentId, keys };
}

/** Same current key and same set of keys — i.e. nothing to save or upload. */
export function sameKeyring(a: BackupKeyring, b: BackupKeyring): boolean {
  return (
    a.currentId === b.currentId &&
    a.keys.length === b.keys.length &&
    a.keys.every((entry) => findKeyringKey(b, entry.id))
  );
}

/**
 * Decrypts with whichever key of the keyring the backup was written with.
 * Throws `unknown-key` if none matches.
 */
export function decryptBackupWithKeyring(
  content: string,
  keyring: BackupKeyring,
): string {
  const { keyId } = readEncryptedBackup(content);
  const entry = findKeyringKey(keyring, keyId);
  if (!entry) throw new BackupCryptoError("unknown-key");
  return decryptBackup(content, entry.key);
}

interface SerializedKeyring {
  format: typeof BACKUP_KEYRING_FORMAT;
  version: number;
  currentId: string | null;
  keys: { key: string; createdAt: number }[];
}

/** JSON form, for a secure store or a private cloud file. Contains the raw keys. */
export function serializeKeyring(keyring: BackupKeyring): string {
  const serialized: SerializedKeyring = {
    format: BACKUP_KEYRING_FORMAT,
    version: BACKUP_KEYRING_VERSION,
    currentId: keyring.currentId,
    keys: keyring.keys.map(({ key, createdAt }) => ({
      key: encodeBackupKey(key),
      createdAt,
    })),
  };
  return JSON.stringify(serialized);
}

function corrupted(): BackupCryptoError {
  return new BackupCryptoError("corrupted", "Malformed backup keyring.");
}

/**
 * Reverse of {@link serializeKeyring}. Key ids are recomputed from the keys
 * rather than trusted; a `currentId` that matches none of them is dropped.
 */
export function parseKeyring(content: string): BackupKeyring {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw corrupted();
  }
  const data = parsed as Partial<SerializedKeyring> | null;
  if (data?.format !== BACKUP_KEYRING_FORMAT) {
    throw corrupted();
  }
  if (
    typeof data.version !== "number" ||
    data.version > BACKUP_KEYRING_VERSION
  ) {
    throw new BackupCryptoError("unsupported-version");
  }
  if (!Array.isArray(data.keys)) throw corrupted();

  let keyring: BackupKeyring = emptyKeyring;
  for (const entry of data.keys as unknown[]) {
    const { key, createdAt } = (entry ?? {}) as {
      key?: unknown;
      createdAt?: unknown;
    };
    if (typeof key !== "string" || typeof createdAt !== "number")
      throw corrupted();
    keyring = addKeyToKeyring(keyring, decodeBackupKey(key), { createdAt });
  }
  const currentId =
    typeof data.currentId === "string" &&
    findKeyringKey(keyring, data.currentId)
      ? data.currentId
      : null;
  return { ...keyring, currentId };
}
