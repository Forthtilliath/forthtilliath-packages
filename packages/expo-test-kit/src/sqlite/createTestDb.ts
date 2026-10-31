import { type Client, createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";

/**
 * A Drizzle database on libsql (Node), shaped like the app's `expo-sqlite` one,
 * with `$client` to close it.
 */
export type TestDb<TSchema extends Record<string, unknown>> =
  LibSQLDatabase<TSchema> & {
    $client: Client;
  };

// Chemin du fichier temporaire associé à chaque instance, pour le nettoyer
// dans closeTestDb() sans changer la forme de la valeur retournée par
// createTestDb() (qui doit rester une TestDb utilisable directement).
/**
 * Temporary file of each test database, so {@link closeTestDb} can delete it.
 * @internal
 */
export const tempFilesByDb = new WeakMap<object, string>();

// Base SQLite en mémoire (libsql) utilisable dans les tests pour exercer la
// vraie logique SQL d'un repository Drizzle (contraintes de clé étrangère,
// transactions...) sans dépendre d'expo-sqlite, indisponible hors d'une
// app Expo/RN réelle. Contrairement à better-sqlite3/sql.js, le driver
// libsql de drizzle est en mode "async" comme celui d'expo-sqlite : les
// transactions avec callback `async (tx) => {...}` fonctionnent donc à
// l'identique en test et en production.
/**
 * Creates a real SQLite database for tests, in a temporary file, with the app's
 * Drizzle `schema` and its migrations applied — so queries, constraints and
 * foreign keys behave as on the device (`expo-sqlite` itself only runs on a
 * device). Foreign keys are enforced.
 * @param schema - The app's Drizzle schema module (`import * as schema from
 *   "../db/schema"`).
 * @param migrationsFolder - The folder `drizzle-kit generate` writes to, e.g.
 *   `"./drizzle"`.
 * @returns The database; close it with {@link closeTestDb}.
 * @example
 * let testDb: TestDb<typeof schema>;
 * beforeAll(async () => { testDb = await createTestDb(schema, "./drizzle"); });
 * afterAll(() => closeTestDb(testDb));
 */
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
  // libsql already enables foreign keys by default (on every connection,
  // transactions included — checked by this package's tests); kept explicit
  // so the tests don't silently depend on that default.
  await client.execute("PRAGMA foreign_keys = ON;");

  tempFilesByDb.set(db, dbFile);
  return db;
}
