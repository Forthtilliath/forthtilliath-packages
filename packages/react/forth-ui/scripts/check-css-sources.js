// Checks that src/styles/globals.css scans every shadcn-ui component forth-ui
// uses (directly, or through another shadcn-ui component): a missing one
// means its classes are absent from the published CSS. Run by `lint`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shadcnSrc = join(root, "../shadcn-ui/src");
const IMPORT_RE = /@forthtilliath\/shadcn-ui\/([a-z0-9/-]+)/g;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(dir, entry.name))
      : /\.tsx?$/.test(entry.name)
        ? [join(dir, entry.name)]
        : [],
  );
}

const used = new Set();
const queue = [];
const add = (path) => {
  if (!used.has(path)) {
    used.add(path);
    queue.push(path);
  }
};
for (const file of walk(join(root, "src"))) {
  for (const [, path] of readFileSync(file, "utf8").matchAll(IMPORT_RE)) {
    add(path);
  }
}
while (queue.length > 0) {
  const path = queue.shift();
  const file = [`${path}.tsx`, `${path}.ts`]
    .map((candidate) => join(shadcnSrc, candidate))
    .find((candidate) => existsSync(candidate));
  if (file === undefined) continue;
  const source = readFileSync(file, "utf8");
  for (const [, dep] of source.matchAll(IMPORT_RE)) add(dep);
  for (const [, rel] of source.matchAll(/from "(\.\.?\/[a-z0-9/.-]+)"/g)) {
    add(
      posix
        .normalize(posix.join(posix.dirname(path), rel))
        .replace(/\.js$/, ""),
    );
  }
}

const css = readFileSync(join(root, "src/styles/globals.css"), "utf8");
const scanned =
  /shadcn-ui\/src\/components\/\{([^}]+)\}\.tsx/.exec(css)?.[1].split(",") ??
  [];
const missing = [...used]
  .filter((path) => path.startsWith("components/"))
  .map((path) => path.slice("components/".length))
  .filter((name) => !scanned.includes(name));

if (missing.length > 0) {
  console.error(
    `src/styles/globals.css: add ${missing.join(", ")} to the shadcn-ui @source list.`,
  );
  process.exit(1);
}
