// Substitue une TestDb à l'instance réelle exportée par un module (typiquement
// "./client" ou "@/db/client"), pour les fichiers de test important un
// repository construit sur ce client. `doMock` reste au choix de l'appelant
// (`jest.doMock` ou `vi.doMock`) plutôt que codé en dur, ce module n'ayant pas
// d'opinion sur le test runner utilisé. À appeler dans un beforeAll, avant le
// require()/import() du module testé : `doMock` n'est pas hoisté comme
// `jest.mock`/`vi.mock`, donc l'ordre d'appel est respecté.
/**
 * Makes the app's database module (the one exporting `db`) return the test
 * database, so repositories under test write to it.
 * @param doMock - `jest.doMock` or `vi.doMock` (not the hoisted `mock`: the
 *   test database only exists once created).
 * @param modulePath - The app's database module, as the test file imports it
 *   (e.g. `"../db/client"`).
 * @param testDb - The database from {@link createTestDb}, exposed as `db`.
 * @example
 * mockDbClient(jest.doMock, "../db/client", testDb);
 * const { addFood } = await import("../db/repository");
 */
export function mockDbClient(
  doMock: (moduleId: string, factory: () => unknown) => void,
  modulePath: string,
  testDb: unknown,
) {
  doMock(modulePath, () => ({ db: testDb }));
}
