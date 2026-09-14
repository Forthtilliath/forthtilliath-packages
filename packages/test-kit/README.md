# @forthtilliath/test-kit

Framework-agnostic test helpers: a `fetch()` mock response builder, a JSON
fixture loader, and an in-memory file system fake — extracted from patterns
duplicated across test files in this monorepo, none of them tied to Expo or
any other framework (see `@forthtilliath/expo-test-kit` for the
Expo/Drizzle-specific ones: a real SQLite test database and an
`expo-file-system` fake).

## Install

```bash
npm install --save-dev @forthtilliath/test-kit
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "devDependencies": {
    "@forthtilliath/test-kit": "workspace:*"
  }
}
```

## Usage

Import everything you need from the package root, or one module at a time:

```ts
import { createMockResponse, loadJsonFixture } from "@forthtilliath/test-kit";
// or
import { createMockResponse } from "@forthtilliath/test-kit/createMockResponse";
```

### `createMockResponse(body, options?)`

Builds a `fetch()` `Response`-shaped object (`ok`, `status`, `headers`,
`json()`, `text()`) resolving `body` as JSON. Wrap it in your test runner's
own mock function — this package has no opinion on Jest vs Vitest.

```ts
vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue(createMockResponse({ id: 1 })),
);
// an error case:
vi.fn().mockResolvedValue(createMockResponse({}, { status: 404 }));
```

### `loadJsonFixture(importMetaUrl, relativePath)`

Reads and JSON-parses a fixture file relative to the calling module,
resolved from `import.meta.url` — the ESM-safe replacement for the
CommonJS `__dirname` trick.

```ts
const release = loadJsonFixture<GithubRelease>(
  import.meta.url,
  "./fixtures/github-release.json",
);
```

### `createInMemoryFileSystem(initialFiles?)`

A minimal in-memory file system (`exists`, `readFile`, `writeFile`,
`deleteFile`, `reset`, and the underlying `files` map for direct
inspection) — enough to test code that reads/writes files by path (e.g. via
`node:fs/promises`) without touching the real disk.

```ts
const fakeFs = createInMemoryFileSystem({ "/config.json": "{}" });
vi.mock("node:fs/promises", () => fakeFs);
```

## Scripts

```bash
pnpm run dev            # tsc --watch -> dist/
pnpm run build          # tsc -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
pnpm run test           # vitest run
pnpm run test:watch     # vitest
```

Built to `dist/` (see the `exports` field in `package.json`), so run
`pnpm run build` (or `dev`) after source changes for consumers to see them.
