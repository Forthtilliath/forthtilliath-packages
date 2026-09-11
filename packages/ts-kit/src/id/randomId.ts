/**
 * `crypto.randomUUID()` with a fallback. That API only exists in a secure
 * context (HTTPS or `localhost`) and is missing on a few older browsers. The
 * fallbacks are not cryptographically secure but are good enough for local
 * identifiers.
 *
 * @returns {string} A UUID-v4-shaped string, or a timestamp-based id as a last resort.
 */
export function randomId(): string {
  // `globalThis.crypto` is typed as always present by lib.dom, but it can be
  // missing at runtime (older browser, insecure context) — cast it away so
  // the checks below are not flagged as unnecessary.
  const c = (globalThis as { crypto?: Crypto }).crypto;

  if (typeof c?.randomUUID === "function") {
    return c.randomUUID();
  }

  if (typeof c?.getRandomValues === "function") {
    const bytes = c.getRandomValues(new Uint8Array(16));
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40; // version 4
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80; // variant
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return (
      hex.slice(0, 4).join("") +
      "-" +
      hex.slice(4, 6).join("") +
      "-" +
      hex.slice(6, 8).join("") +
      "-" +
      hex.slice(8, 10).join("") +
      "-" +
      hex.slice(10, 16).join("")
    );
  }

  return `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}
