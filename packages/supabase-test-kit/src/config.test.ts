import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { supabaseTestConfig } from "./config.js";

describe("supabaseTestConfig", () => {
  it("runs files one after the other, in Node", () => {
    expect(supabaseTestConfig).toMatchObject({
      environment: "node",
      fileParallelism: false,
    });
  });

  it("points to the global setup module", () => {
    const [path = ""] = supabaseTestConfig.globalSetup;
    // Built as dist/globalSetup.js; from the sources, next to the .ts file
    expect(path).toMatch(/[\\/]globalSetup\.js$/);
    expect(existsSync(path.replace(/\.js$/, ".ts"))).toBe(true);
  });
});
