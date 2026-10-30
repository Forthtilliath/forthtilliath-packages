import { describe, expect, it } from "vitest";

import {
  type AttemptLimiterStorage,
  createAttemptLimiter,
} from "./createAttemptLimiter.js";

function memoryStorage(initial?: string) {
  const items = new Map<string, string>();
  if (initial !== undefined) items.set("failures", initial);
  const storage: AttemptLimiterStorage = {
    getItem: (key) => Promise.resolve(items.get(key) ?? null),
    setItem: (key, value) => {
      items.set(key, value);
      return Promise.resolve();
    },
    deleteItem: (key) => {
      items.delete(key);
      return Promise.resolve();
    },
  };
  return { items, storage };
}

function setup(initial?: string) {
  const clock = { now: 1_000_000 };
  const { items, storage } = memoryStorage(initial);
  const limiter = createAttemptLimiter({
    storage,
    key: "failures",
    now: () => clock.now,
  });
  return { clock, items, limiter };
}

const wrong = () => false;
const right = () => true;

describe("createAttemptLimiter", () => {
  it("allows 4 free failures, then delays 30 s, 1 min, 5 min, 15 min…", () => {
    const { limiter } = setup();
    expect([4, 5, 6, 7, 8, 20].map(limiter.delayAfter)).toEqual([
      0, 30_000, 60_000, 300_000, 900_000, 900_000,
    ]);
  });

  it("locks after the 5th failure until the delay is over", async () => {
    const { clock, limiter } = setup();
    for (let i = 0; i < 4; i++) {
      expect(await limiter.attempt(wrong)).toEqual({
        ok: false,
        lockedUntil: 0,
      });
    }
    expect(await limiter.attempt(wrong)).toEqual({
      ok: false,
      lockedUntil: clock.now + 30_000,
    });

    // Even the right secret is refused while locked, without checking it.
    let checked = false;
    const result = await limiter.attempt(() => (checked = true));
    expect(result).toEqual({ ok: false, lockedUntil: clock.now + 30_000 });
    expect(checked).toBe(false);

    clock.now += 30_000;
    expect(await limiter.getLockedUntil()).toBe(0);
    expect(await limiter.attempt(right)).toEqual({ ok: true });
  });

  it("resets the counter on success", async () => {
    const { items, limiter } = setup();
    await limiter.attempt(wrong);
    await limiter.attempt(right);
    expect(items.has("failures")).toBe(false);
  });

  it("treats an unreadable counter as used up, not as zero", async () => {
    const { clock, limiter } = setup("not json");
    expect(await limiter.attempt(wrong)).toEqual({
      ok: false,
      lockedUntil: clock.now + 30_000,
    });

    const tampered = setup(JSON.stringify({ count: -3, lastFailureAt: 0 }));
    expect(await tampered.limiter.attempt(wrong)).toEqual({
      ok: false,
      lockedUntil: tampered.clock.now + 30_000,
    });
  });

  it("restarts the delay from now when the clock was set back", async () => {
    const { clock, items, limiter } = setup(
      JSON.stringify({ count: 5, lastFailureAt: 5_000_000 }),
    );
    expect(await limiter.getLockedUntil()).toBe(clock.now + 30_000);
    expect(items.get("failures")).toBe(
      JSON.stringify({ count: 5, lastFailureAt: clock.now }),
    );
  });

  it("counts every failure of parallel attempts", async () => {
    const { items, limiter } = setup();
    await Promise.all([1, 2, 3].map(() => limiter.attempt(wrong)));
    expect(JSON.parse(items.get("failures") ?? "{}")).toMatchObject({
      count: 3,
    });
  });

  it("reset() forgets the failures", async () => {
    const { limiter } = setup(
      JSON.stringify({ count: 9, lastFailureAt: 1_000_000 }),
    );
    expect(await limiter.getLockedUntil()).not.toBe(0);
    await limiter.reset();
    expect(await limiter.getLockedUntil()).toBe(0);
  });
});
