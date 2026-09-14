import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Reads and JSON-parses a fixture file located relative to the calling
 * module, resolving the path from `import.meta.url` — the ESM-safe
 * replacement for the CommonJS `__dirname` trick (which doesn't exist in a
 * `"type": "module"` test file).
 *
 * @param importMetaUrl - Pass `import.meta.url` from the calling test file.
 * @param relativePath - Path to the fixture, relative to that file.
 *
 * @example
 * const release = loadJsonFixture<GithubRelease>(
 *   import.meta.url,
 *   "./fixtures/github-release.json",
 * );
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- single-use type parameter is the point of this assertion helper
export function loadJsonFixture<T = unknown>(
  importMetaUrl: string,
  relativePath: string,
): T {
  const fixturePath = fileURLToPath(new URL(relativePath, importMetaUrl));
  return JSON.parse(readFileSync(fixturePath, "utf-8")) as T;
}
