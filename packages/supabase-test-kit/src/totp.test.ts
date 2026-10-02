import { describe, expect, it } from "vitest";

import { totpCode } from "./totp.js";

// RFC 6238, annexe B : secret ASCII « 12345678901234567890 » en base32, SHA-1
const RFC_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

describe("totpCode", () => {
  it.each([
    [59, "287082"],
    [1111111109, "081804"],
    [1111111111, "050471"],
    [1234567890, "005924"],
    [2000000000, "279037"],
  ])("matches the RFC 6238 vector at %i s", (seconds, code) => {
    expect(totpCode(RFC_SECRET, seconds * 1000)).toBe(code);
  });

  it("keeps the same code within a 30 s step", () => {
    expect(totpCode(RFC_SECRET, 60_000)).toBe(totpCode(RFC_SECRET, 89_999));
  });

  it("accepts lowercase, spaces and padding", () => {
    expect(totpCode("gezd gnbv gy3t qojq gezd gnbv gy3t qojq==", 59_000)).toBe(
      "287082",
    );
  });

  it("rejects a secret that isn't base32", () => {
    expect(() => totpCode("not-base32!")).toThrow(/base32/);
  });
});
