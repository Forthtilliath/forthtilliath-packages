import { ESLint } from "eslint";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createNextJsConfig } from "./nextjs.js";

const FIXTURES_DIR = fileURLToPath(
  new URL("./__fixtures__/nextjs", import.meta.url),
);

/** @param {Parameters<typeof createNextJsConfig>[0]} [options] */
function createLinter(options) {
  return new ESLint({
    cwd: FIXTURES_DIR,
    overrideConfigFile: true,
    baseConfig: createNextJsConfig({ turbo: false, ...options }),
  });
}

/** @param {ESLint} eslint */
async function namingConventionMessages(eslint) {
  const [result] = await eslint.lintFiles(["snake-case.ts"]);
  return (result?.messages ?? []).filter(
    (message) => message.ruleId === "@typescript-eslint/naming-convention",
  );
}

describe("createNextJsConfig", () => {
  it("rejects snake_case variables by default", async () => {
    const messages = await namingConventionMessages(createLinter());
    expect(messages).toHaveLength(2);
  });

  it("accepts snake_case variables with snakeCase: true", async () => {
    const messages = await namingConventionMessages(
      createLinter({ snakeCase: true }),
    );
    expect(messages).toEqual([]);
  });

  it("ignores Next.js build output and next-env.d.ts", async () => {
    const eslint = createLinter();
    for (const path of [
      ".next/server/page.js",
      "out/index.js",
      "build/index.js",
      "next-env.d.ts",
    ]) {
      expect(await eslint.isPathIgnored(path)).toBe(true);
    }
  });

  it("never enables the same rule in both react-hooks and @eslint-react", async () => {
    const config = await createLinter().calculateConfigForFile("component.tsx");
    const enabled = Object.entries(
      /** @type {Record<string, import("eslint").Linter.RuleEntry>} */ (
        config.rules
      ),
    )
      .filter(([, entry]) => {
        const level = Array.isArray(entry) ? entry[0] : entry;
        return level !== "off" && level !== 0;
      })
      .map(([name]) => name);
    const eslintReact = new Set(
      enabled
        .filter((name) => name.startsWith("@eslint-react/"))
        .map((name) => name.slice("@eslint-react/".length)),
    );
    const duplicated = enabled
      .filter((name) => name.startsWith("react-hooks/"))
      .map((name) => name.slice("react-hooks/".length))
      .filter((rule) => eslintReact.has(rule));
    expect(duplicated).toEqual([]);
  });
});
