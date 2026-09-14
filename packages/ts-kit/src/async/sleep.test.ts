import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sleep } from "./sleep.js";

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves only after the given delay has elapsed", async () => {
    let resolved = false;
    void sleep(1000).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(999);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });
});
