#!/usr/bin/env node
// `changeset publish` shells out to `npm publish` per package, inheriting
// this process's env. pnpm exports its own resolved config as `npm_config_*`
// env vars for exactly that kind of nested npm call — but a few pnpm-only
// keys (catalogs, verify-deps-before-run, the JSR registry setting) aren't
// npm config options at all, so npm prints an "Unknown env config" warning
// for each on every publish. Harmless, but noisy — strip them first.
import { spawnSync } from "node:child_process";

const PNPM_ONLY_ENV_KEYS = [
  "npm_config_catalog",
  "npm_config_verify_deps_before_run",
  "npm_config__jsr_registry",
];

for (const key of PNPM_ONLY_ENV_KEYS) delete process.env[key];

const result = spawnSync("npx", ["changeset", "publish"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
