import { describe, expect, it } from "vitest";

import {
  type KeyValueStorage,
  readPersisted,
  writePersisted,
} from "./persistedState.js";

function createAsyncStorage(): KeyValueStorage & {
  items: Map<string, string>;
} {
  const items = new Map<string, string>();
  return {
    items,
    getItem: (key) => Promise.resolve(items.get(key) ?? null),
    setItem: (key, value) => {
      items.set(key, value);
      return Promise.resolve();
    },
  };
}

describe("writePersisted / readPersisted", () => {
  it("round-trips a { state, version } envelope", async () => {
    const storage = createAsyncStorage();
    await writePersisted(storage, "settings", { dark: true }, 1);
    expect(storage.items.get("settings")).toBe(
      '{"state":{"dark":true},"version":1}',
    );
    await expect(readPersisted(storage, "settings")).resolves.toEqual({
      state: { dark: true },
      version: 1,
    });
  });

  it("works with a synchronous storage", async () => {
    const items = new Map<string, string>();
    const storage: KeyValueStorage = {
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => items.set(key, value),
    };
    await writePersisted(storage, "k", [1, 2], 3);
    await expect(readPersisted(storage, "k")).resolves.toEqual({
      state: [1, 2],
      version: 3,
    });
  });

  it("throws when nothing is persisted", async () => {
    await expect(
      readPersisted(createAsyncStorage(), "missing"),
    ).rejects.toThrow('Nothing is persisted under "missing"');
  });

  it("throws when the value isn't a persist envelope", async () => {
    const storage = createAsyncStorage();
    storage.items.set("raw", '{"dark":true}');
    await expect(readPersisted(storage, "raw")).rejects.toThrow(
      "{ state, version }",
    );
  });
});
