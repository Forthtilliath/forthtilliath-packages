/** Where the failure counter is kept — e.g. expo-secure-store on Android. */
export interface AttemptLimiterStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}

export interface AttemptLimiterOptions {
  storage: AttemptLimiterStorage;
  /** Storage key of the failure counter. */
  key: string;
  /** Failures allowed before any delay. @defaultValue 4 */
  freeAttempts?: number;
  /**
   * Delay imposed after the first failure past `freeAttempts`, the second…
   * the last one repeating for every failure after.
   * @defaultValue 30 s, 1 min, 5 min, 15 min
   */
  delaysMs?: readonly number[];
  /** @defaultValue `Date.now` */
  now?: () => number;
}

export type AttemptResult = { ok: true } | { ok: false; lockedUntil: number };

export interface AttemptLimiter {
  /**
   * Runs `verify` (e.g. compares a PIN) unless a delay is running, and
   * updates the counter: reset on success, one more failure otherwise.
   * `lockedUntil` is the end of the delay now imposed (0 for none). Attempts
   * run one at a time, so parallel ones can't lose a failure.
   */
  attempt: (verify: () => boolean | Promise<boolean>) => Promise<AttemptResult>;
  /** End of the running delay (a timestamp), or 0 if an attempt is allowed. */
  getLockedUntil: () => Promise<number>;
  /** Forgets every failure (e.g. once the PIN is reset another way). */
  reset: () => Promise<void>;
  /** The delay imposed after `count` consecutive failures (0 for none). */
  delayAfter: (count: number) => number;
}

interface Failures {
  count: number;
  lastFailureAt: number;
}

const DEFAULT_DELAYS_MS = [30_000, 60_000, 5 * 60_000, 15 * 60_000];
const MAX_COUNT = 1_000_000;

/**
 * Limits attempts at a secret (a PIN, a passphrase) with growing delays:
 * after `freeAttempts` failures, each new one imposes a wait. The counter is
 * persisted through `storage`, so closing the app doesn't reset it, and an
 * unreadable value is never taken as "no failure" (tampering with it would
 * otherwise lift the limit): the next failure is then delayed at once. A
 * last failure dated in the future (the clock was set back) restarts the
 * delay from now instead of locking until that date.
 *
 * @example
 * const pinLock = createAttemptLimiter({
 *   storage: {
 *     getItem: SecureStore.getItemAsync,
 *     setItem: SecureStore.setItemAsync,
 *     deleteItem: SecureStore.deleteItemAsync,
 *   },
 *   key: "pin-failures",
 * });
 * const result = await pinLock.attempt(() => isPinCorrect(typedPin));
 * if (!result.ok && result.lockedUntil) showWaitUntil(result.lockedUntil);
 */
export function createAttemptLimiter({
  storage,
  key,
  freeAttempts = 4,
  delaysMs = DEFAULT_DELAYS_MS,
  now = Date.now,
}: AttemptLimiterOptions): AttemptLimiter {
  let queue: Promise<unknown> = Promise.resolve();

  function delayAfter(count: number): number {
    if (count <= freeAttempts || delaysMs.length === 0) return 0;
    const index = Math.min(count - freeAttempts - 1, delaysMs.length - 1);
    return delaysMs[index] ?? 0;
  }

  async function readFailures(): Promise<Failures> {
    const raw = await storage.getItem(key);
    if (raw === null || raw === "") return { count: 0, lastFailureAt: 0 };
    try {
      const { count, lastFailureAt } = JSON.parse(raw) as Partial<Failures>;
      if (
        typeof count === "number" &&
        Number.isInteger(count) &&
        count >= 0 &&
        count <= MAX_COUNT &&
        typeof lastFailureAt === "number" &&
        Number.isFinite(lastFailureAt) &&
        lastFailureAt >= 0
      ) {
        return { count, lastFailureAt };
      }
    } catch {
      // Unreadable: handled below.
    }
    return { count: freeAttempts, lastFailureAt: 0 };
  }

  async function writeFailures(failures: Failures) {
    await storage.setItem(key, JSON.stringify(failures));
  }

  async function lockedUntil(): Promise<number> {
    const failures = await readFailures();
    const current = now();
    if (failures.lastFailureAt > current) {
      failures.lastFailureAt = current;
      await writeFailures(failures);
    }
    const until = failures.lastFailureAt + delayAfter(failures.count);
    return until > current ? until : 0;
  }

  function serialized<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  }

  return {
    delayAfter,
    getLockedUntil: () => serialized(lockedUntil),
    reset: () => serialized(() => storage.deleteItem(key)),
    attempt: (verify) =>
      serialized(async (): Promise<AttemptResult> => {
        const locked = await lockedUntil();
        if (locked) return { ok: false, lockedUntil: locked };
        if (await verify()) {
          await storage.deleteItem(key);
          return { ok: true };
        }
        const { count } = await readFailures();
        const failures = {
          count: Math.min(count + 1, MAX_COUNT),
          lastFailureAt: now(),
        };
        await writeFailures(failures);
        const delay = delayAfter(failures.count);
        return {
          ok: false,
          lockedUntil: delay ? failures.lastFailureAt + delay : 0,
        };
      }),
  };
}
