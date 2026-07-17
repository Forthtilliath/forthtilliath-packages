import type { Linter } from "eslint";

import { nextJsConfig } from "@forthtilliath/eslint-config/nextjs";

const config: Linter.Config[] = [
  // Generated, registry-flavored copies of packages/react/forth-ui source
  // (see scripts/generate-forth-ui-registry.ts) — meant for an external
  // consumer's project (import specifiers like `@/lib/utils` only resolve
  // there), not for this app's own compile/lint.
  { ignores: ["registry/**"] },
  ...nextJsConfig,
];

export default config;
