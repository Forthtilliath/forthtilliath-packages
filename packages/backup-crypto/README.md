# @forthtilliath/backup-crypto

Encrypt an app's backup (typically a JSON export) with a random app-generated key — no password for the user to pick or remember. Pure TypeScript on top of audited libraries ([`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers), [`@noble/hashes`](https://github.com/paulmillr/noble-hashes), [`@scure/base`](https://github.com/paulmillr/scure-base)): no native module, runs in React Native, browsers and Node.

Used by [`@forthtilliath/expo-backup`](../expo-backup#readme), which stores the keys (secure store + private Google Drive copy). Use this package directly only for another platform (e.g. a web app reading the same backups).

## Install

```bash
npm install @forthtilliath/backup-crypto
```

## Format

An encrypted backup is still JSON — file pickers filtering on `application/json` keep working — but only its header is readable:

```json
{
  "format": "forthtilliath.encrypted-backup",
  "version": 1,
  "app": "glucodose",
  "keyId": "3f9c0a1b2c3d4e5f",
  "cipher": "xchacha20-poly1305",
  "nonce": "…",
  "ciphertext": "…"
}
```

- **XChaCha20-Poly1305** with a 256-bit key and a fresh random 192-bit nonce per backup: safe to encrypt every backup with the same key.
- The header (format, version, app, keyId, cipher) is authenticated: editing it makes decryption fail instead of being trusted.
- `keyId` is a domain-separated hash of the key (not the key): it says which key of a keyring to use.

## Usage

```ts
import {
  decryptBackupWithKeyring,
  emptyKeyring,
  encryptBackup,
  ensureCurrentKey,
  formatRecoveryCode,
  getCurrentKey,
  isEncryptedBackup,
  parseRecoveryCode,
} from "@forthtilliath/backup-crypto";

let keyring = ensureCurrentKey(emptyKeyring); // generates a key
const key = getCurrentKey(keyring)!.key;

const file = encryptBackup(JSON.stringify(data), key, { app: "glucodose" });
isEncryptedBackup(file); // true
const json = decryptBackupWithKeyring(file, keyring);

// Human-friendly form of the key, to write down: 55 Crockford base32 chars
// with a checksum, e.g. "7K3QD-…". Tolerates case, spaces and I/L/O typos.
const code = formatRecoveryCode(key);
parseRecoveryCode(code); // the key again
```

### Keyrings

A keyring keeps every key an app ever encrypted with, so files written before a key change (other phone, reinstall) stay readable; new backups use `currentId`. All helpers are immutable:

| Function                                          |                                                       |
| ------------------------------------------------- | ----------------------------------------------------- |
| `ensureCurrentKey(keyring, randomBytes?)`         | Adds a current key if there's none                    |
| `addKeyToKeyring(keyring, key, { makeCurrent? })` | Adds a key (current if the keyring had none)          |
| `mergeKeyrings(preferred, other)`                 | Union; `preferred`'s current key wins                 |
| `sameKeyring(a, b)`                               | Nothing to save or upload                             |
| `serializeKeyring` / `parseKeyring`               | JSON form (contains the raw keys — store it securely) |

### Errors

Everything throws a `BackupCryptoError` with a `code`: `not-encrypted`, `unsupported-version`, `unknown-key` (ask for the recovery code of the device that wrote it), `corrupted` (truncated or tampered with), `invalid-recovery-code` (typo), `no-random-source`.

### Randomness

Keys and nonces come from `crypto.getRandomValues`, or the `randomBytes` option — pass `expo-crypto`'s `getRandomBytes` in React Native. There's no `Math.random` fallback: without a secure source, encryption throws `no-random-source`.
