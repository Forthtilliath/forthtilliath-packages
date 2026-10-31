import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Minimal fixture schema, only used by this package's own tests to exercise
// createTestDb/closeTestDb/resetTestDb against a real (temporary) SQLite
// file — not shipped to consumers.
/**
 * Fixture table used by this package's own tests.
 * @internal
 */
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

/**
 * Fixture table (child of `items`, `ON DELETE RESTRICT`) used by this package's
 * own tests.
 * @internal
 */
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "restrict" }),
  label: text("label").notNull(),
});
