#!/usr/bin/env node
// Staged publishing: the CI token is "stage only", so it cannot publish a
// version by itself. Each new version is submitted to npm's staging area and
// only goes live once a maintainer approves it with 2FA (npmjs.com ▸ Staged
// Packages, or `npm stage approve <stage-id> --otp <code>`). A leaked token
// therefore cannot ship a malicious version.
//
// `npm stage publish` packs the current directory with npm, which would keep
// pnpm's `workspace:^` / `catalog:` specifiers as-is in the published
// manifest. So each package is packed with `pnpm pack` first (which rewrites
// them to real versions), extracted, and staged from that folder.
//
// Requires npm >= 11.15 and Node >= 22.14. Set PUBLISH_DRY_RUN=1 to run
// everything with `--dry-run` and without creating git tags.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// pnpm exports its own resolved config as `npm_config_*` env vars; a few
// pnpm-only keys aren't npm options at all, and npm warns about each of them
// on every call. Harmless, but noisy — strip them first.
const PNPM_ONLY_ENV_KEYS = [
  "npm_config_catalog",
  "npm_config_verify_deps_before_run",
  "npm_config__jsr_registry",
];
for (const key of PNPM_ONLY_ENV_KEYS) delete process.env[key];

const DRY_RUN = process.env.PUBLISH_DRY_RUN === "1";

function run(command, args, { cwd, capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    shell: true,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

// Every non-private workspace package, nested ones included
// (packages/react/*) — the same set `changeset publish` would consider.
function publishablePackages() {
  const { ok, stdout } = run("pnpm", ["-r", "ls", "--json", "--depth", "-1"], {
    capture: true,
  });
  if (!ok) throw new Error("Could not list the workspace packages.");
  return JSON.parse(stdout)
    .filter((pkg) => pkg.name && pkg.version && !pkg.private)
    .map((pkg) => ({ dir: pkg.path, name: pkg.name, version: pkg.version }));
}

function isPublished({ name, version }) {
  const { ok, stdout } = run(
    "npm",
    ["view", `${name}@${version}`, "version", "--json"],
    { capture: true },
  );
  return ok && stdout.includes(`"${version}"`);
}

function isStaged({ name, version }) {
  const { ok, stdout } = run("npm", ["stage", "list", name, "--json"], {
    capture: true,
  });
  return ok && stdout.includes(`"${version}"`);
}

function stage(pkg) {
  const workDir = mkdtempSync(join(tmpdir(), "stage-"));
  try {
    if (
      !run("pnpm", ["pack", "--pack-destination", JSON.stringify(workDir)], {
        cwd: pkg.dir,
      }).ok
    )
      return false;
    const tarball = readdirSync(workDir).find((file) => file.endsWith(".tgz"));
    if (!tarball) return false;
    if (
      !run("tar", [
        "-xzf",
        JSON.stringify(join(workDir, tarball)),
        "-C",
        JSON.stringify(workDir),
      ]).ok
    )
      return false;
    // Lifecycle scripts already ran (or are irrelevant) at pack time: the
    // extracted folder has no sources to build from.
    const args = [
      "stage",
      "publish",
      "--ignore-scripts",
      ...(DRY_RUN ? ["--dry-run"] : []),
    ];
    return run("npm", args, { cwd: join(workDir, "package") }).ok;
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

const staged = [];
let failed = false;

for (const pkg of publishablePackages()) {
  const id = `${pkg.name}@${pkg.version}`;
  if (isPublished(pkg)) continue;
  if (isStaged(pkg)) {
    console.log(`${id} is already staged, waiting for approval.`);
    continue;
  }
  console.log(`\nStaging ${id}…`);
  if (stage(pkg)) staged.push(id);
  else {
    console.error(`Failed to stage ${id}.`);
    failed = true;
  }
}

if (staged.length > 0 && !DRY_RUN) {
  // Same as `changeset publish`: tag the new versions. `changeset tag` itself
  // prints the "New tag:" lines changesets/action parses to push tags and
  // create the GitHub releases — printing them again would make the action
  // push each tag twice, and the second push fails.
  run("npx", ["changeset", "tag"]);
  console.log(
    `\n${staged.length} version(s) staged. Approve each with 2FA on npmjs.com ` +
      "(Staged Packages) or with `npm stage approve <stage-id> --otp <code>`.",
  );
}

process.exit(failed ? 1 : 0);
