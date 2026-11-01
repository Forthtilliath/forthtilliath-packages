import { describe, expect, it } from "vitest";

import { verifyBearerToken } from "./verifyBearerToken.js";

const SECRET = "0123456789abcdef0123456789abcdef";

describe("verifyBearerToken", () => {
  it("accepts the right token", () => {
    expect(verifyBearerToken(`Bearer ${SECRET}`, SECRET)).toBe(true);
  });

  it("accepts the scheme in any case and extra spaces", () => {
    expect(verifyBearerToken(`bearer   ${SECRET} `, SECRET)).toBe(true);
  });

  it("rejects a wrong token", () => {
    expect(verifyBearerToken(`Bearer ${SECRET.slice(0, -1)}x`, SECRET)).toBe(
      false,
    );
  });

  it("rejects a prefix or an extension of the token", () => {
    expect(verifyBearerToken(`Bearer ${SECRET.slice(0, -1)}`, SECRET)).toBe(
      false,
    );
    expect(verifyBearerToken(`Bearer ${SECRET}0`, SECRET)).toBe(false);
  });

  it("rejects a missing or malformed header", () => {
    expect(verifyBearerToken(null, SECRET)).toBe(false);
    expect(verifyBearerToken(undefined, SECRET)).toBe(false);
    expect(verifyBearerToken("", SECRET)).toBe(false);
    expect(verifyBearerToken(SECRET, SECRET)).toBe(false);
    expect(verifyBearerToken(`Basic ${SECRET}`, SECRET)).toBe(false);
    expect(verifyBearerToken(`Bearer ${SECRET} extra`, SECRET)).toBe(false);
  });

  it("fails closed when the secret is missing", () => {
    expect(verifyBearerToken("Bearer undefined", undefined)).toBe(false);
    expect(verifyBearerToken("Bearer null", null)).toBe(false);
    expect(verifyBearerToken("Bearer ", "")).toBe(false);
  });

  it("fails closed when the secret is too short", () => {
    expect(verifyBearerToken("Bearer short", "short")).toBe(false);
  });

  it("accepts a shorter secret when allowed", () => {
    expect(
      verifyBearerToken("Bearer short", "short", { minSecretLength: 5 }),
    ).toBe(true);
  });

  it("never accepts an empty secret, whatever the minimum", () => {
    expect(verifyBearerToken("Bearer ", "", { minSecretLength: 0 })).toBe(
      false,
    );
  });
});
