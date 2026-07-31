# @forthtilliath/expo-test-kit

Test helpers for Expo/Drizzle apps: a real in-memory SQLite database (via libsql) to exercise a Drizzle repository's actual SQL, and a lightweight `expo-file-system` fake — both extracted from patterns that were duplicated across test files rather than shared.

## Install

```bash
npm install --save-dev @forthtilliath/expo-test-kit drizzle-orm @libsql/client
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "devDependencies": {
    "@forthtilliath/expo-test-kit": "workspace:*"
  }
}
```

`drizzle-orm` and `@libsql/client` are peer dependencies — install them if not already present. Both are dev-only: `expo-test-kit` doesn't touch your app's production `expo-sqlite` driver, it's a separate in-memory database used only while testing.

## Usage

Each function is its own module — import the file you need directly:

```ts
import {
  createTestDb,
  type TestDb,
} from "@forthtilliath/expo-test-kit/createTestDb";
import { closeTestDb } from "@forthtilliath/expo-test-kit/closeTestDb";
import { resetTestDb } from "@forthtilliath/expo-test-kit/resetTestDb";
import { mockDbClient } from "@forthtilliath/expo-test-kit/mockDbClient";
```

### `createTestDb(schema, migrationsFolder)` / `closeTestDb(db)` / `resetTestDb(db, tables)`

A real SQLite database (via `libsql`, in a temp file — not `:memory:`, since some internal libsql connections reopen the database separately) with your actual Drizzle migrations replayed against it, and foreign keys enforced. Lets a repository's tests hit real SQL (constraints, transactions) instead of a mocked driver.

```ts
import * as schema from "./schema";

let testDb: TestDb<typeof schema>;

beforeAll(async () => {
  testDb = await createTestDb(schema, path.join(__dirname, "../../drizzle"));
});

afterAll(() => {
  closeTestDb(testDb);
});

beforeEach(async () => {
  // Order matters for foreign keys in "restrict" mode: children before parents.
  await resetTestDb(testDb, [schema.tags, schema.items]);
});
```

### `mockDbClient(doMock, modulePath, testDb)`

Substitutes a `TestDb` for the real client exported by a module (typically `"./client"` or `"@/db/client"`), for test files importing a repository built on that client. `doMock` is your test runner's own mock function (`jest.doMock` or `vi.doMock`) — this package has no opinion on which one you use.

```ts
beforeAll(async () => {
  testDb = await createTestDb(schema, migrationsFolder);
  mockDbClient(jest.doMock, "./client", testDb); // or vi.doMock
  repo = require("./repository"); // after mockDbClient, not hoisted like jest.mock
});
```

### `createFakeExpoFileSystem()` / `getFakeExpoFileSystem()`

A minimal in-memory `File`/`Paths` fake — enough to test code that reads/writes files via `expo-file-system`, without the native filesystem (unavailable under Jest/Vitest).

```ts
import {
  createFakeExpoFileSystem,
  getFakeExpoFileSystem,
} from "@forthtilliath/expo-test-kit/createFakeExpoFileSystem";

// jest.mock's factory can't reference an outer variable, so stash + retrieve
// instead of closing over one:
jest.mock("expo-file-system", () => createFakeExpoFileSystem());

let fakeFs: ReturnType<typeof getFakeExpoFileSystem>;

beforeAll(() => {
  fakeFs = getFakeExpoFileSystem();
});
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

Built to `dist/` (see the `exports` field in `package.json`), so run `pnpm run build` (or `dev`) after source changes for consumers to see them.
