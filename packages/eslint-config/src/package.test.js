import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * @type {{
 *   dependencies: Record<string, string>;
 *   peerDependencies: Record<string, string>;
 *   peerDependenciesMeta: Record<string, { optional?: boolean }>;
 *   devDependencies: Record<string, string>;
 * }}
 */
const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

/** Peer dependencies every variant needs, hence not optional. */
const REQUIRED_PEERS = ["eslint", "typescript"];

/**
 * Packages imported (statically, through `import()` or through
 * `requireOptional()`) by each published module, keyed by its path relative
 * to src/.
 * @returns {Map<string, Set<string>>}
 */
function importsBySourceFile() {
  /** @type {Map<string, Set<string>>} */
  const imports = new Map();
  for (const dir of ["", "internal/"]) {
    const files = readdirSync(new URL(`./${dir}`, import.meta.url)).filter(
      (file) => file.endsWith(".js") && !file.endsWith(".test.js"),
    );
    for (const file of files) {
      const source = readFileSync(
        new URL(`./${dir}${file}`, import.meta.url),
        "utf8",
      );
      const specifiers = [
        // `import ... from "x"` statements (anchored to the start of a line,
        // so a comment quoting `from "..."` doesn't match), `import("x")`, or
        // `requireOptional("x", ...)`.
        ...source.matchAll(
          /(?:^import\s[^;]*?\sfrom\s|import\(|requireOptional\(\s*)"([^".][^"]*)"/gm,
        ),
      ].map(([, specifier = ""]) => specifier);
      imports.set(
        `${dir}${file}`,
        new Set(
          specifiers
            .filter((specifier) => !specifier.startsWith("node:"))
            .map((specifier) =>
              specifier
                .split("/")
                .slice(0, specifier.startsWith("@") ? 2 : 1)
                .join("/"),
            ),
        ),
      );
    }
  }
  return imports;
}

describe("package.json dependencies", () => {
  const imports = importsBySourceFile();
  const allImports = new Set([...imports.values()].flatMap((set) => [...set]));

  it("declares every imported package", () => {
    const declared = new Set([
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ]);
    expect([...allImports].filter((name) => !declared.has(name))).toEqual([]);
  });

  it("only installs what the base config needs", () => {
    // Anything else (React, React Native, Next.js, Storybook, Angular
    // plugins, Turborepo) would land in every consumer, whatever variant it
    // uses — e.g. angular-eslint pulling the whole Angular CLI into a React
    // Native app.
    const baseImports = new Set([
      ...(imports.get("base.js") ?? []),
      ...(imports.get("internal/optional-plugin.js") ?? []),
      ...(imports.get("internal/lazy-config.js") ?? []),
      ...(imports.get("internal/turborepo.js") ?? []),
    ]);
    expect(
      Object.keys(pkg.dependencies).filter((name) => !baseImports.has(name)),
    ).toEqual([]);
  });

  it("makes every variant- or option-specific plugin an optional peer", () => {
    const peers = Object.keys(pkg.peerDependencies).filter(
      (name) => !REQUIRED_PEERS.includes(name),
    );
    expect(
      peers.filter((name) => pkg.peerDependenciesMeta[name]?.optional !== true),
    ).toEqual([]);
  });

  it("installs every optional peer locally, for this package's own tests", () => {
    expect(
      Object.keys(pkg.peerDependenciesMeta).filter(
        (name) => !(name in pkg.devDependencies),
      ),
    ).toEqual([]);
  });
});
