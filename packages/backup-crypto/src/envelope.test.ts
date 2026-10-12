import { afterEach, describe, expect, it, vi } from "vitest";

import {
  decodeBackupKey,
  generateBackupKey,
  getBackupKeyId,
} from "./backupKey.js";
import {
  decryptBackup,
  encryptBackup,
  isEncryptedBackup,
  readEncryptedBackup,
} from "./envelope.js";
import { BackupCryptoError } from "./errors.js";

const plaintext = JSON.stringify({
  foods: [{ name: "Pâtes", carbs: 70 }],
  note: "🍝",
});

function expectCode(fn: () => unknown, code: string) {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(BackupCryptoError);
    expect((error as BackupCryptoError).code).toBe(code);
    return;
  }
  throw new Error(`expected a ${code} error`);
}

function tamper(
  content: string,
  edit: (envelope: Record<string, unknown>) => void,
) {
  const envelope = JSON.parse(content) as Record<string, unknown>;
  edit(envelope);
  return JSON.stringify(envelope);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("encryptBackup / decryptBackup", () => {
  it("round-trips unicode text", () => {
    const key = generateBackupKey();
    const encrypted = encryptBackup(plaintext, key, { app: "glucodose" });
    expect(decryptBackup(encrypted, key)).toBe(plaintext);
  });

  it("never leaks the plaintext in the envelope", () => {
    const encrypted = encryptBackup(plaintext, generateBackupKey());
    expect(encrypted).not.toContain("Pâtes");
    expect(encrypted).not.toContain("foods");
  });

  it("uses a fresh nonce every time", () => {
    const key = generateBackupKey();
    const a = readEncryptedBackup(encryptBackup(plaintext, key));
    const b = readEncryptedBackup(encryptBackup(plaintext, key));
    expect(a.nonce).not.toBe(b.nonce);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });

  it("records the app and key id in clear", () => {
    const key = generateBackupKey();
    const envelope = readEncryptedBackup(
      encryptBackup(plaintext, key, { app: "7wonders" }),
    );
    expect(envelope).toMatchObject({
      app: "7wonders",
      keyId: getBackupKeyId(key),
      version: 1,
    });
  });

  it("rejects another key as unknown-key", () => {
    const encrypted = encryptBackup(plaintext, generateBackupKey());
    expectCode(
      () => decryptBackup(encrypted, generateBackupKey()),
      "unknown-key",
    );
  });

  it("rejects a tampered ciphertext as corrupted", () => {
    const encrypted = encryptBackup(plaintext, generateBackupKey());
    const key = generateBackupKey();
    const forged = encryptBackup(plaintext, key);
    const swapped = tamper(forged, (e) => {
      e.ciphertext = readEncryptedBackup(encrypted).ciphertext;
    });
    expectCode(() => decryptBackup(swapped, key), "corrupted");
  });

  it("rejects an edited header as corrupted (authenticated)", () => {
    const key = generateBackupKey();
    const edited = tamper(encryptBackup(plaintext, key, { app: "a" }), (e) => {
      e.app = "b";
    });
    expectCode(() => decryptBackup(edited, key), "corrupted");
  });

  it("rejects invalid base64 as corrupted", () => {
    const key = generateBackupKey();
    const broken = tamper(encryptBackup(plaintext, key), (e) => {
      e.nonce = "%%%";
    });
    expectCode(() => decryptBackup(broken, key), "corrupted");
  });

  it("rejects a key of the wrong length", () => {
    expectCode(() => encryptBackup(plaintext, new Uint8Array(16)), "corrupted");
    expectCode(() => decryptBackup("{}", new Uint8Array(16)), "corrupted");
  });

  it("refuses to encrypt without a usable random source", () => {
    const key = generateBackupKey();
    expectCode(
      () =>
        encryptBackup(plaintext, key, { randomBytes: () => new Uint8Array(3) }),
      "no-random-source",
    );
    vi.stubGlobal("crypto", undefined);
    expectCode(() => encryptBackup(plaintext, key), "no-random-source");
  });
});

describe("readEncryptedBackup", () => {
  it("reports plain JSON and garbage as not-encrypted", () => {
    expectCode(() => readEncryptedBackup(plaintext), "not-encrypted");
    expectCode(() => readEncryptedBackup("not json"), "not-encrypted");
    expectCode(() => readEncryptedBackup("null"), "not-encrypted");
  });

  it("reports a newer or missing version as unsupported-version", () => {
    const encrypted = encryptBackup(plaintext, generateBackupKey());
    const newer = tamper(encrypted, (e) => {
      e.version = 2;
    });
    const missing = tamper(encrypted, (e) => {
      delete e.version;
    });
    expectCode(() => readEncryptedBackup(newer), "unsupported-version");
    expectCode(() => readEncryptedBackup(missing), "unsupported-version");
  });

  it("reports missing fields as corrupted", () => {
    const encrypted = encryptBackup(plaintext, generateBackupKey());
    const noNonce = tamper(encrypted, (e) => {
      delete e.nonce;
    });
    expectCode(() => readEncryptedBackup(noNonce), "corrupted");
  });
});

describe("isEncryptedBackup", () => {
  it("tells envelopes from plain exports", () => {
    expect(
      isEncryptedBackup(encryptBackup(plaintext, generateBackupKey())),
    ).toBe(true);
    expect(isEncryptedBackup(plaintext)).toBe(false);
    expect(isEncryptedBackup("not json")).toBe(false);
  });
});

describe("backup keys", () => {
  it("rejects malformed encoded keys", () => {
    expectCode(() => decodeBackupKey("%%%"), "corrupted");
    expectCode(() => decodeBackupKey("AAAA"), "corrupted");
  });

  it("rejects a randomBytes returning the wrong length", () => {
    expectCode(
      () => generateBackupKey(() => new Uint8Array(8)),
      "no-random-source",
    );
  });

  it("derives a stable 16-hex-char id", () => {
    const key = new Uint8Array(32).fill(7);
    expect(getBackupKeyId(key)).toMatch(/^[0-9a-f]{16}$/);
    expect(getBackupKeyId(key)).toBe(
      getBackupKeyId(new Uint8Array(32).fill(7)),
    );
  });
});
