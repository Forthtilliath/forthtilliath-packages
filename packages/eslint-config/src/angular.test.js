import { ESLint } from "eslint";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { angularConfig } from "./angular.js";

// `angular.js` has no real consumer in this monorepo (yet) — unlike the
// other variants, which are already exercised by whatever package/app lints
// under them. Running it here, against real fixture files via ESLint's Node
// API, is the substitute: it catches the config crashing outright (this
// package's README documents two variants that once did, from a default
// instead of named import) or silently failing to enforce its own rules.
const FIXTURES_DIR = fileURLToPath(
  new URL("./__fixtures__/angular", import.meta.url),
);

function createLinter() {
  return new ESLint({
    cwd: FIXTURES_DIR,
    overrideConfigFile: true,
    baseConfig: angularConfig,
  });
}

describe("angularConfig", () => {
  it("lints a well-formed component without errors", async () => {
    const eslint = createLinter();
    const [result] = await eslint.lintFiles(["good.component.ts"]);
    expect(result.messages).toEqual([]);
  });

  it("lints a well-formed template without errors", async () => {
    const eslint = createLinter();
    const [result] = await eslint.lintFiles(["good.component.html"]);
    expect(result.messages).toEqual([]);
  });

  it("flags a selector that breaks the app-/kebab-case convention", async () => {
    const eslint = createLinter();
    const [result] = await eslint.lintFiles(["bad-selector.component.ts"]);
    const ruleIds = result.messages.map((message) => message.ruleId);
    expect(ruleIds).toContain("@angular-eslint/component-selector");
  });

  it("flags @angular/core/rxjs imports not grouped ahead of other packages", async () => {
    const eslint = createLinter();
    const [result] = await eslint.lintFiles(["bad-import-order.component.ts"]);
    const ruleIds = result.messages.map((message) => message.ruleId);
    expect(ruleIds).toContain("simple-import-sort/imports");
  });
});
