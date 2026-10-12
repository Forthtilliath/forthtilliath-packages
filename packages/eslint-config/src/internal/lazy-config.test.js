import { defineConfig } from "eslint/config";
import { describe, expect, it, vi } from "vitest";

import { lazyConfig } from "./lazy-config.js";

/** @type {import("eslint").Linter.Config[]} */
const CONFIG = [{ ignores: ["dist/**"] }, { rules: { "no-console": "error" } }];

describe("lazyConfig", () => {
  it("doesn't build the config until it's read", () => {
    const create = vi.fn(() => CONFIG);
    lazyConfig(create);
    expect(create).not.toHaveBeenCalled();
  });

  it("behaves like the config array once read, building it only once", () => {
    const create = vi.fn(() => CONFIG);
    const config = lazyConfig(create);
    expect(Array.isArray(config)).toBe(true);
    expect(config).toHaveLength(2);
    expect(config[1]).toBe(CONFIG[1]);
    expect([...config]).toEqual(CONFIG);
    expect(Object.keys(config)).toEqual(["0", "1"]);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("is flattened by defineConfig, spread or nested", () => {
    expect(defineConfig([...lazyConfig(() => CONFIG)])).toEqual(CONFIG);
    expect(defineConfig([lazyConfig(() => CONFIG)])).toEqual(CONFIG);
  });

  it("surfaces the factory's error when read, not when created", () => {
    const config = lazyConfig(() => {
      throw new Error("missing plugin");
    });
    expect(() => [...config]).toThrow("missing plugin");
  });
});
