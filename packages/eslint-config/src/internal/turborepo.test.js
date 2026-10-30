import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { isInsideTurborepo } from "./turborepo.js";

describe("isInsideTurborepo", () => {
  /** @type {string[]} */
  const dirs = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true });
  });

  /** @returns {string} */
  function tempDir() {
    const dir = mkdtempSync(join(tmpdir(), "eslint-config-turbo-"));
    dirs.push(dir);
    return dir;
  }

  it("finds a turbo.json in a parent directory", () => {
    const root = tempDir();
    writeFileSync(join(root, "turbo.json"), "{}");
    const app = join(root, "apps", "web");
    mkdirSync(app, { recursive: true });
    expect(isInsideTurborepo(app)).toBe(true);
  });

  it("is false outside a Turborepo", () => {
    expect(isInsideTurborepo(tempDir())).toBe(false);
  });
});
