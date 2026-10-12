import { getRandomBytes } from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import {
  addKeyToKeyring,
  type BackupKeyring,
  decryptBackupWithKeyring,
  emptyKeyring,
  encryptBackup,
  ensureCurrentKey,
  formatRecoveryCode,
  getBackupKeyId,
  getCurrentKey,
  isEncryptedBackup,
  parseKeyring,
  parseRecoveryCode,
  serializeKeyring,
} from "@forthtilliath/backup-crypto";

import { BackupError, normalizeBackupError } from "./errors.js";

/**
 * - `off`: backups are plain JSON.
 * - `optional`: the user chooses (off by default).
 * - `required`: always encrypted, no toggle — for sensitive data (health…).
 */
export type EncryptionMode = "off" | "optional" | "required";

export interface Encryption {
  isActive: () => boolean;
  /** Encrypts `plaintext` with the current key (generated on first use) when active. */
  encode: (plaintext: string) => Promise<string>;
  /** Decrypts an encrypted backup with whichever known key wrote it; plain JSON passes through. */
  decode: (content: string) => Promise<string>;
  loadKeyring: () => Promise<BackupKeyring>;
  saveKeyring: (keyring: BackupKeyring) => Promise<void>;
  /** The current key as a recovery code, generating the key if needed. */
  getRecoveryCode: () => Promise<string>;
  /**
   * Adds the key behind a recovery code (current one if the device had
   * none). With `expectedKeyId`, rejects a valid code for another key with
   * `recovery-code-mismatch` instead of adding it.
   */
  addRecoveryCode: (code: string, expectedKeyId?: string) => Promise<void>;
  /** The keyring with a current key added when encryption is active and it had none. */
  ensureKeyIfActive: (keyring: BackupKeyring) => BackupKeyring;
  /** Called whenever the local keyring changes, so it can be escrowed to the cloud. */
  onKeyringChange: (listener: () => void) => void;
}

export function createEncryption({
  appId,
  mode,
  isEnabled,
}: {
  appId: string;
  mode: EncryptionMode;
  /** The user's choice, only read in `optional` mode. */
  isEnabled: () => boolean;
}): Encryption {
  // Kept in the Android Keystore-backed secure store, which Expo excludes
  // from Android's automatic backup: the keys never leave the device
  // except through the private Drive copy or the recovery code.
  const storeKey = `forthtilliath-backup.${appId}.keyring`;
  let keyringChanged: (() => void) | null = null;

  async function loadKeyring(): Promise<BackupKeyring> {
    const stored = await SecureStore.getItemAsync(storeKey);
    if (stored === null) return emptyKeyring;
    try {
      return parseKeyring(stored);
    } catch (error) {
      throw normalizeBackupError(error);
    }
  }

  async function saveKeyring(keyring: BackupKeyring): Promise<void> {
    await SecureStore.setItemAsync(storeKey, serializeKeyring(keyring));
    keyringChanged?.();
  }

  async function currentKeyring(): Promise<BackupKeyring> {
    const keyring = await loadKeyring();
    const ensured = ensureCurrentKey(keyring, getRandomBytes);
    if (ensured !== keyring) await saveKeyring(ensured);
    return ensured;
  }

  const isActive = () =>
    mode === "required" || (mode === "optional" && isEnabled());

  return {
    isActive,
    async encode(plaintext) {
      if (!isActive()) return plaintext;
      const key = getCurrentKey(await currentKeyring());
      // ensureCurrentKey guarantees one.
      if (!key) throw new Error("No current backup key.");
      return encryptBackup(plaintext, key.key, {
        app: appId,
        randomBytes: getRandomBytes,
      });
    },
    async decode(content) {
      // Plain exports stay importable even with encryption required: they
      // predate it, or come from a device where it was off.
      if (!isEncryptedBackup(content)) return content;
      try {
        return decryptBackupWithKeyring(content, await loadKeyring());
      } catch (error) {
        throw normalizeBackupError(error);
      }
    },
    loadKeyring,
    saveKeyring,
    async getRecoveryCode() {
      const key = getCurrentKey(await currentKeyring());
      if (!key) throw new Error("No current backup key.");
      return formatRecoveryCode(key.key);
    },
    async addRecoveryCode(code, expectedKeyId) {
      let key: Uint8Array;
      try {
        key = parseRecoveryCode(code);
      } catch (error) {
        throw normalizeBackupError(error);
      }
      if (
        expectedKeyId !== undefined &&
        getBackupKeyId(key) !== expectedKeyId
      ) {
        throw new BackupError("recovery-code-mismatch");
      }
      await saveKeyring(addKeyToKeyring(await loadKeyring(), key));
    },
    ensureKeyIfActive: (keyring) =>
      isActive() ? ensureCurrentKey(keyring, getRandomBytes) : keyring,
    onKeyringChange(listener) {
      keyringChanged = listener;
    },
  };
}
