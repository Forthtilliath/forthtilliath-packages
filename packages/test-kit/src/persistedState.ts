/**
 * The bits of a key-value storage these helpers use — satisfied by
 * React Native's `AsyncStorage` as by the web's `localStorage`.
 */
export interface KeyValueStorage {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => unknown;
}

/** What Zustand's `persist` middleware writes under its storage key. */
export interface PersistedState<T = unknown> {
  state: T;
  version: number;
}

/**
 * Reads what Zustand's `persist` middleware wrote under `key` — to check
 * what a store actually saves on the device. Throws if nothing is there, or
 * if it isn't a `{ state, version }` envelope.
 *
 * @example
 * await expect(readPersisted(AsyncStorage, "settings")).resolves.toEqual({
 *   state: { theme: "dark" },
 *   version: 2,
 * });
 */
export async function readPersisted<T = unknown>(
  storage: KeyValueStorage,
  key: string,
): Promise<PersistedState<T>> {
  const raw = await storage.getItem(key);
  if (raw === null) throw new Error(`Nothing is persisted under "${key}"`);
  const parsed: unknown = JSON.parse(raw);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("state" in parsed) ||
    !("version" in parsed) ||
    typeof parsed.version !== "number"
  ) {
    throw new Error(`"${key}" doesn't hold a { state, version } envelope`);
  }
  return parsed as PersistedState<T>;
}

/**
 * Writes `state` under `key` the way Zustand's `persist` middleware would —
 * to simulate data left on the device by an earlier app version, before the
 * store rehydrates (and migrates) it.
 *
 * @example
 * await writePersisted(AsyncStorage, "settings", { dark: true }, 1);
 * // …then import or rehydrate the store, and check the migrated state.
 */
export async function writePersisted(
  storage: KeyValueStorage,
  key: string,
  state: unknown,
  version: number,
): Promise<void> {
  await storage.setItem(key, JSON.stringify({ state, version }));
}
