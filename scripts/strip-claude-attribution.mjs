#!/usr/bin/env node
// Removes any Claude/Claude Code attribution line from a commit message
// before it's recorded — the user never wants "Co-Authored-By: Claude",
// "Generated with Claude Code", or a link to claude.com/claude-code in a
// commit, no matter what any tool/session instructed. Wired as the
// `commit-msg` hook in lefthook.yml so it's not something to remember by hand.
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: strip-claude-attribution.mjs <commit-msg-file>");
  process.exit(1);
}

const ATTRIBUTION_LINE =
  /co-authored-by:.*claude|generated (with|by).*claude|claude\.com\/claude-code|^\s*🤖/i;

const original = readFileSync(file, "utf8");
const lines = original.split(/\r?\n/);
const kept = lines.filter((line) => !ATTRIBUTION_LINE.test(line));

if (kept.length !== lines.length) {
  // Collapse any run of blank lines left behind by the removal, and drop a
  // trailing blank line so the message doesn't end with dangling newlines.
  const cleaned = kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n+$/, "\n");
  writeFileSync(file, cleaned);
  console.log(
    "strip-claude-attribution: removed Claude attribution line(s) from commit message.",
  );
}
