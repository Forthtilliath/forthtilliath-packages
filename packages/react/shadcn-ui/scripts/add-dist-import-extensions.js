// Post-build step: adds the `.js` extension (or `/index.js`) to relative
// imports in dist/, so the published ESM loads under plain Node (Vitest with
// externalized deps, SSR scripts…) and not only through a bundler.
//
// Done on the build output rather than in src/ on purpose: src/ holds shadcn
// components copied as-is, which must stay identical to shadcn's own code.
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));
const SPECIFIER =
  /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\bexport\s*\*\s*from\s*)(["'])(\.{1,2}(?:\/[^"']*)?)\2/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function withExtension(file, spec) {
  if (/\.(js|css|json)$/.test(spec)) return spec;
  const base = path.resolve(path.dirname(file), spec);
  if (existsSync(`${base}.js`)) return `${spec.replace(/\/$/, "")}.js`;
  if (existsSync(path.join(base, "index.js")))
    return `${spec.replace(/\/$/, "")}/index.js`;
  return spec;
}

let rewritten = 0;
for (const file of walk(distDir)) {
  if (!/\.(js|d\.ts)$/.test(file)) continue;
  const source = readFileSync(file, "utf8");
  const output = source.replace(SPECIFIER, (match, prefix, quote, spec) => {
    const next = withExtension(file, spec);
    if (next === spec) return match;
    rewritten++;
    return `${prefix}${quote}${next}${quote}`;
  });
  if (output !== source) writeFileSync(file, output);
}
console.log(
  `add-dist-import-extensions: ${String(rewritten)} import(s) rewritten`,
);
