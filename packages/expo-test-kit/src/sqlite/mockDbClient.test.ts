import { describe, expect, it, vi } from "vitest";

import { mockDbClient } from "./mockDbClient.js";

describe("mockDbClient", () => {
  it("registers a mock factory returning { db: testDb } for the given module path", () => {
    const doMock = vi.fn();
    const testDb = { fake: true };

    mockDbClient(doMock, "./client", testDb);

    expect(doMock).toHaveBeenCalledTimes(1);
    const [modulePath, factory] = doMock.mock.calls[0] as [
      string,
      () => unknown,
    ];
    expect(modulePath).toBe("./client");
    expect(factory()).toEqual({ db: testDb });
  });
});
