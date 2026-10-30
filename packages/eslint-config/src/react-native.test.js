import { ESLint } from "eslint";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createReactNativeConfig } from "./react-native.js";

const FIXTURES_DIR = fileURLToPath(
  new URL("./__fixtures__/react-native", import.meta.url),
);

/** @param {Parameters<typeof createReactNativeConfig>[0]} [options] */
async function expoMessages(options) {
  const eslint = new ESLint({
    cwd: FIXTURES_DIR,
    overrideConfigFile: true,
    baseConfig: createReactNativeConfig({ turbo: false, ...options }),
  });
  const [result] = await eslint.lintFiles(["env.ts"]);
  return (result?.messages ?? [])
    .map((message) => message.ruleId)
    .filter((ruleId) => ruleId?.startsWith("expo/"));
}

describe("createReactNativeConfig", () => {
  it("leaves the Expo rules off by default", async () => {
    expect(await expoMessages()).toEqual([]);
  });

  it("flags destructured and dynamic env vars with expo: true", async () => {
    expect((await expoMessages({ expo: true })).sort()).toEqual([
      "expo/no-dynamic-env-var",
      "expo/no-env-var-destructuring",
    ]);
  });

  it("loads from a CommonJS eslint.config.js", () => {
    // The config Expo's templates generate is CommonJS: `require()` refuses
    // a module that (or whose imports) uses a top-level `await`.
    const require = createRequire(import.meta.url);
    /** @type {typeof import("./react-native.js")} */
    const loaded = require("./react-native.js");
    expect(
      Array.isArray(loaded.createReactNativeConfig({ turbo: false })),
    ).toBe(true);
  });
});
