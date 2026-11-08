/**
 * A number in `[0, 1)` drawn from `crypto.getRandomValues`, to pass as the
 * `random` argument of {@link shuffle} or {@link pickRandom} instead of
 * `Math.random` when the draw must not be predictable (a fair game draw, a
 * lottery). The value has 32 bits of precision: picking among `n` elements
 * deviates from uniform by at most `n / 2³²`, negligible for any real list.
 *
 * Unlike `crypto.randomUUID`, `getRandomValues` also works outside a secure
 * context (plain HTTP); it exists in every current browser and in Node ≥ 19.
 *
 * @returns A cryptographically random number, `0 <= n < 1`.
 * @throws {Error} When `crypto.getRandomValues` is unavailable, rather than
 * silently falling back to a predictable source.
 * @example
 * shuffle(deck, secureRandom);
 * pickRandom(players, secureRandom);
 */
export function secureRandom(): number {
  // Typed as always present by lib.dom, but missing on very old runtimes.
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (typeof c?.getRandomValues !== "function") {
    throw new Error("secureRandom: crypto.getRandomValues is unavailable");
  }
  const [value = 0] = c.getRandomValues(new Uint32Array(1));
  return value / 0x1_0000_0000;
}
