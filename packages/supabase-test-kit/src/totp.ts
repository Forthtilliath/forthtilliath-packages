import { createHmac } from "node:crypto";

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(secret: string): Buffer {
  let bits = "";
  for (const char of secret.toUpperCase().replace(/[\s=]/g, "")) {
    const value = BASE32.indexOf(char);
    if (value < 0) throw new Error(`Invalid base32 character: ${char}`);
    bits += value.toString(2).padStart(5, "0");
  }
  const bytes = bits.match(/.{8}/g) ?? [];
  return Buffer.from(bytes.map((byte) => parseInt(byte, 2)));
}

/**
 * Current TOTP code of a base32 secret (RFC 6238: HMAC-SHA1, 30 s step,
 * 6 digits), as an authenticator app shows it — e.g. to sign in an MFA test
 * account, or to verify the factor it was just enrolled with.
 *
 * @param secret - The base32 secret (`totp.secret` of `mfa.enroll`).
 * @param now - The time in milliseconds (defaults to now).
 * @returns The 6-digit code.
 * @throws {Error} If the secret isn't valid base32.
 * @example
 * const code = totpCode(process.env.TEST_TOTP_SECRET!);
 */
export function totpCode(secret: string, now: number = Date.now()): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(now / 30_000)));
  const hmac = createHmac("sha1", base32Decode(secret))
    .update(counter)
    .digest();
  const offset = (hmac.at(-1) ?? 0) & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return code.toString().padStart(6, "0");
}
