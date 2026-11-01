import { describe, expect, it } from "vitest";

import { isAllowedUrl } from "./isAllowedUrl.js";

const hosts = ["example.com", "raw.githubusercontent.com"];

describe("isAllowedUrl", () => {
  it("accepts an allowed host", () => {
    expect(isAllowedUrl("https://example.com/a.png", { hosts })).toBe(true);
  });

  it("accepts a subdomain of an allowed host", () => {
    expect(isAllowedUrl("https://cdn.example.com/a.png", { hosts })).toBe(true);
  });

  it("accepts a URL object", () => {
    expect(isAllowedUrl(new URL("https://example.com"), { hosts })).toBe(true);
  });

  it("rejects a host that only ends with an allowed name", () => {
    expect(isAllowedUrl("https://evilexample.com/a.png", { hosts })).toBe(
      false,
    );
  });

  it("rejects an allowed name used as a subdomain of another host", () => {
    expect(isAllowedUrl("https://example.com.evil.net/", { hosts })).toBe(
      false,
    );
  });

  it("rejects internal addresses", () => {
    expect(isAllowedUrl("https://169.254.169.254/latest", { hosts })).toBe(
      false,
    );
    expect(isAllowedUrl("https://localhost/", { hosts })).toBe(false);
  });

  it("rejects http by default", () => {
    expect(isAllowedUrl("http://example.com/", { hosts })).toBe(false);
  });

  it("accepts the protocols given", () => {
    expect(
      isAllowedUrl("http://example.com/", {
        hosts,
        protocols: ["http:", "https:"],
      }),
    ).toBe(true);
  });

  it("rejects other schemes", () => {
    expect(isAllowedUrl("javascript:alert(1)", { hosts })).toBe(false);
    expect(isAllowedUrl("file:///etc/passwd", { hosts })).toBe(false);
  });

  it("rejects URLs with credentials", () => {
    expect(isAllowedUrl("https://user:pass@example.com/", { hosts })).toBe(
      false,
    );
  });

  it("rejects unparsable values", () => {
    expect(isAllowedUrl("not a url", { hosts })).toBe(false);
    expect(isAllowedUrl("", { hosts })).toBe(false);
  });

  it("matches hosts whatever the URL's case", () => {
    expect(isAllowedUrl("https://CDN.Example.COM/", { hosts })).toBe(true);
  });
});
