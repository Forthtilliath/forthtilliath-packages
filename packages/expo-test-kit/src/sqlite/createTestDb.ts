import { type Client, createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";

export type TestDb<TSchema extends Record<string, unknown>> =
  LibSQLDatabase<TSchema> & {
    $client: Client;
  };

// Chemin du fichier temporaire associé à chaque instance, pour le nettoyer
// dans closeTestDb() sans changer la forme de la valeur retournée par
// createTestDb() (qui doit rester une TestDb utilisable directement).
export const tempFilesByDb = new WeakMap<object, string>();

// Base SQLite en mémoire (libsql) utilisable dans les tests pour exercer la
// vraie logique SQL d'un repository Drizzle (contraintes de clé étrangère,
// transactions...) sans dépendre d'expo-sqlite, indisponible hors d'une
// app Expo/RN réelle. Contrairement à better-sqlite3/sql.js, le driver
// libsql de drizzle est en mode "async" comme celui d'expo-sqlite : les
// transactions avec callback `async (tx) => {...}` fonctionnent donc à
// l'identique en test et en production.
export async function createTestDb<TSchema extends Record<string, unknown>>(
  schema: TSchema,
  migrationsFolder: string,
): Promise<TestDb<TSchema>> {
  // Un fichier réel (et non ":memory:") : certaines connexions internes du
  // client libsql ré-ouvrent la base séparément (transactions, migrations),
  // ce qui repartirait sur une base vide à chaque fois avec ":memory:".
  const dbFile = path.join(os.tmpdir(), `expo-test-kit-${randomUUID()}.sqlite`);
  const client = createClient({ url: `file:${dbFile}` });
  const db = drizzle(client, { schema });

  await migrate(db, { migrationsFolder });
  await client.execute("PRAGMA foreign_keys = ON;");

  tempFilesByDb.set(db, dbFile);
  return db;
}
