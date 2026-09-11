import { afterEach, describe, expect, it, vi } from "vitest";

import { randomId } from "./randomId.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("randomId", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses crypto.randomUUID when available", () => {
    const randomUUID = vi.fn(() => "11111111-1111-4111-8111-111111111111");
    vi.stubGlobal("crypto", { randomUUID });

    expect(randomId()).toBe("11111111-1111-4111-8111-111111111111");
    expect(randomUUID).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it("falls back to crypto.getRandomValues when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (arr: Uint8Array) => {
        arr.fill(0xab);
        return arr;
      },
    });

    expect(randomId()).toMatch(UUID_REGEX);

    vi.unstubAllGlobals();
  });

  it("falls back to a timestamp-based id when crypto is entirely unavailable", () => {
    vi.stubGlobal("crypto", undefined);

    expect(randomId()).toMatch(/^id-[0-9a-f]+-[0-9a-f]+$/);

    vi.unstubAllGlobals();
  });
});
