import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Minimal fixture schema, only used by this package's own tests to exercise
// createTestDb/closeTestDb/resetTestDb against a real (temporary) SQLite
// file — not shipped to consumers.
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "restrict" }),
  label: text("label").notNull(),
});
