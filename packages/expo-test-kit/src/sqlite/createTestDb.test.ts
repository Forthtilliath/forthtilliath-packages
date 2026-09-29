import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import * as schema from "./test-fixtures/schema.js";
import { closeTestDb } from "./closeTestDb.js";
import { createTestDb, type TestDb } from "./createTestDb.js";
import { resetTestDb } from "./resetTestDb.js";

const MIGRATIONS_FOLDER = fileURLToPath(
  new URL("./test-fixtures/migrations", import.meta.url),
);

// Drizzle wraps the driver error: the SQLite reason is on `cause`.
// (Vitest's asymmetric matchers are typed `any`, hence the `unknown`s.)
const FOREIGN_KEY_FAILURE: { cause: unknown } = {
  cause: expect.objectContaining({
    message: expect.stringContaining(
      "FOREIGN KEY constraint failed",
    ) as unknown,
  }) as unknown,
};

describe("createTestDb / closeTestDb / resetTestDb", () => {
  let db: TestDb<typeof schema>;

  beforeAll(async () => {
    db = await createTestDb(schema, MIGRATIONS_FOLDER);
  });

  afterAll(() => {
    closeTestDb(db);
  });

  it("applies the real migrations, making the tables usable", async () => {
    const [item] = await db
      .insert(schema.items)
      .values({ name: "Widget" })
      .returning();
    expect(item?.name).toBe("Widget");
  });

  it("enforces foreign key constraints (PRAGMA foreign_keys = ON)", async () => {
    await expect(
      db.insert(schema.tags).values({ itemId: 999_999, label: "orphan" }),
    ).rejects.toMatchObject(FOREIGN_KEY_FAILURE);
  });

  it("also enforces foreign keys inside a transaction", async () => {
    // libsql can run a transaction on a separate connection, where a
    // connection-level PRAGMA set once wouldn't apply.
    await expect(
      db.transaction(async (tx) => {
        await tx
          .insert(schema.tags)
          .values({ itemId: 999_999, label: "orphan" });
      }),
    ).rejects.toMatchObject(FOREIGN_KEY_FAILURE);
  });

  it("resetTestDb empties the given tables in the given order", async () => {
    const [item] = await db
      .insert(schema.items)
      .values({ name: "Gadget" })
      .returning();
    if (!item) throw new Error("insert did not return a row");
    await db.insert(schema.tags).values({ itemId: item.id, label: "new" });

    // tags before items: items.id is referenced by tags with onDelete "restrict".
    await resetTestDb(db, [schema.tags, schema.items]);

    expect(await db.select().from(schema.items)).toEqual([]);
    expect(await db.select().from(schema.tags)).toEqual([]);
  });
});
