import type { SQLiteTable } from "drizzle-orm/sqlite-core";

import type { TestDb } from "./createTestDb.js";

// Vide les tables données entre deux tests, dans l'ordre fourni — c'est à
// l'appelant de placer en premier les tables dont une contrainte de clé
// étrangère en "restrict" empêche la suppression tant qu'une autre table les
// référence encore (les relations en "set null"/"cascade" n'ont pas cette
// contrainte d'ordre).
export async function resetTestDb(
  db: TestDb<Record<string, unknown>>,
  tablesInDeleteOrder: SQLiteTable[],
): Promise<void> {
  for (const table of tablesInDeleteOrder) {
    await db.delete(table);
  }
}
