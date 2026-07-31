// Substitue une TestDb à l'instance réelle exportée par un module (typiquement
// "./client" ou "@/db/client"), pour les fichiers de test important un
// repository construit sur ce client. `doMock` reste au choix de l'appelant
// (`jest.doMock` ou `vi.doMock`) plutôt que codé en dur, ce module n'ayant pas
// d'opinion sur le test runner utilisé. À appeler dans un beforeAll, avant le
// require()/import() du module testé : `doMock` n'est pas hoisté comme
// `jest.mock`/`vi.mock`, donc l'ordre d'appel est respecté.
export function mockDbClient(
  doMock: (moduleId: string, factory: () => unknown) => void,
  modulePath: string,
  testDb: unknown,
) {
  doMock(modulePath, () => ({ db: testDb }));
}
