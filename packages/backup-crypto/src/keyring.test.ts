import { describe, expect, it } from "vitest";

import { generateBackupKey, getBackupKeyId } from "./backupKey.js";
import { encryptBackup } from "./envelope.js";
import { BackupCryptoError } from "./errors.js";
import {
  addKeyToKeyring,
  decryptBackupWithKeyring,
  emptyKeyring,
  ensureCurrentKey,
  getCurrentKey,
  mergeKeyrings,
  parseKeyring,
  sameKeyring,
  serializeKeyring,
} from "./keyring.js";
import { formatRecoveryCode, parseRecoveryCode } from "./recoveryCode.js";

function codeOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (error) {
    return error instanceof BackupCryptoError ? error.code : "other";
  }
  return undefined;
}

describe("keyring", () => {
  it("generates a current key only when missing", () => {
    const keyring = ensureCurrentKey(emptyKeyring);
    expect(getCurrentKey(keyring)).toBeDefined();
    expect(ensureCurrentKey(keyring)).toBe(keyring);
  });

  it("keeps the current key when adding another unless asked", () => {
    const first = generateBackupKey();
    const second = generateBackupKey();
    let keyring = addKeyToKeyring(emptyKeyring, first);
    keyring = addKeyToKeyring(keyring, second);
    expect(keyring.currentId).toBe(getBackupKeyId(first));
    expect(
      addKeyToKeyring(keyring, second, { makeCurrent: true }).currentId,
    ).toBe(getBackupKeyId(second));
    expect(addKeyToKeyring(keyring, first).keys).toHaveLength(2);
  });

  it("merges with the preferred current key and the union of keys", () => {
    const remote = ensureCurrentKey(emptyKeyring);
    const local = ensureCurrentKey(emptyKeyring);
    const merged = mergeKeyrings(remote, local);
    expect(merged.currentId).toBe(remote.currentId);
    expect(merged.keys).toHaveLength(2);
    expect(mergeKeyrings(emptyKeyring, local).currentId).toBe(local.currentId);
    expect(sameKeyring(merged, mergeKeyrings(merged, local))).toBe(true);
    expect(sameKeyring(merged, remote)).toBe(false);
    expect(sameKeyring(local, remote)).toBe(false);
  });

  it("decrypts with whichever key wrote the backup", () => {
    const old = generateBackupKey();
    const keyring = ensureCurrentKey(addKeyToKeyring(emptyKeyring, old));
    const encrypted = encryptBackup("hello", old);
    expect(decryptBackupWithKeyring(encrypted, keyring)).toBe("hello");
    expect(
      codeOf(() => decryptBackupWithKeyring(encrypted, emptyKeyring)),
    ).toBe("unknown-key");
  });

  it("round-trips through its serialized form", () => {
    const keyring = ensureCurrentKey(
      addKeyToKeyring(emptyKeyring, generateBackupKey()),
    );
    const parsed = parseKeyring(serializeKeyring(keyring));
    expect(sameKeyring(parsed, keyring)).toBe(true);
    expect(parsed.keys[0]?.createdAt).toBe(keyring.keys[0]?.createdAt);
  });

  it("drops a current id that matches no key", () => {
    const keyring = ensureCurrentKey(emptyKeyring);
    const json = JSON.parse(serializeKeyring(keyring)) as Record<
      string,
      unknown
    >;
    json.currentId = "deadbeefdeadbeef";
    expect(parseKeyring(JSON.stringify(json)).currentId).toBeNull();
  });

  it("rejects malformed keyrings", () => {
    const valid = JSON.parse(
      serializeKeyring(ensureCurrentKey(emptyKeyring)),
    ) as Record<string, unknown>;
    expect(codeOf(() => parseKeyring("nope"))).toBe("corrupted");
    expect(codeOf(() => parseKeyring("null"))).toBe("corrupted");
    expect(
      codeOf(() => parseKeyring(JSON.stringify({ ...valid, format: "x" }))),
    ).toBe("corrupted");
    expect(
      codeOf(() => parseKeyring(JSON.stringify({ ...valid, version: 9 }))),
    ).toBe("unsupported-version");
    expect(
      codeOf(() => parseKeyring(JSON.stringify({ ...valid, keys: "x" }))),
    ).toBe("corrupted");
    expect(
      codeOf(() => parseKeyring(JSON.stringify({ ...valid, keys: [null] }))),
    ).toBe("corrupted");
  });
});

describe("recovery code", () => {
  it("round-trips and is grouped by 5", () => {
    const key = generateBackupKey();
    const code = formatRecoveryCode(key);
    expect(code).toMatch(/^([0-9A-Z]{5}-){10}[0-9A-Z]{5}$/);
    expect(parseRecoveryCode(code)).toEqual(key);
  });

  it("tolerates case, spaces and I/L/O confusions", () => {
    const key = generateBackupKey();
    const code = formatRecoveryCode(key);
    const typed = ` ${code.replaceAll("-", " ").replaceAll("1", "l").replaceAll("0", "O").toLowerCase()} `;
    expect(parseRecoveryCode(typed)).toEqual(key);
  });

  it("detects a typo through the checksum", () => {
    const code = formatRecoveryCode(generateBackupKey());
    const typo = (code.startsWith("A") ? "B" : "A") + code.slice(1);
    expect(codeOf(() => parseRecoveryCode(typo))).toBe("invalid-recovery-code");
  });

  it("rejects a wrong length or invalid characters", () => {
    const code = formatRecoveryCode(generateBackupKey());
    // 8 chars = exactly 5 bytes: decodes fine, but too short for a key.
    expect(codeOf(() => parseRecoveryCode("00000-000"))).toBe(
      "invalid-recovery-code",
    );
    expect(codeOf(() => parseRecoveryCode(code.slice(0, 20)))).toBe(
      "invalid-recovery-code",
    );
    expect(codeOf(() => parseRecoveryCode("UUUUU"))).toBe(
      "invalid-recovery-code",
    );
  });
});
