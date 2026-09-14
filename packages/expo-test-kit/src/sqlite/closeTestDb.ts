import fs from "node:fs";

import { tempFilesByDb, type TestDb } from "./createTestDb.js";

// À appeler dans un afterAll : ferme la connexion native libsql (sans quoi le
// test runner ne se termine pas proprement) et supprime le fichier temporaire
// (et ses éventuels compagnons -wal/-shm) pour ne pas accumuler des bases de
// test dans le dossier temp à chaque exécution.
export function closeTestDb(db: TestDb<Record<string, unknown>>) {
  db.$client.close();

  const dbFile = tempFilesByDb.get(db);
  if (!dbFile) return;
  for (const file of [dbFile, `${dbFile}-wal`, `${dbFile}-shm`]) {
    try {
      fs.rmSync(file, { force: true });
    } catch {
      // Best effort : sur Windows le handle natif peut rester verrouillé
      // brièvement après close(), un fichier de test qui persiste n'est pas
      // grave (dossier temp, nettoyé de toute façon par l'OS).
    }
  }
}
