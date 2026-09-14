export interface FakeFile {
  uri: string;
  exists: boolean;
  create: () => void;
  write: (content: string) => void;
  delete: () => void;
  text: () => Promise<string>;
}

export interface FakeExpoFileSystem {
  store: Map<string, string>;
  File: new (...parts: (string | { uri: string })[]) => FakeFile;
  Paths: { cache: { uri: string }; document: { uri: string } };
}

const GLOBAL_KEY = "__forthtilliathFakeExpoFileSystem";

// Double léger d'expo-file-system : un simple magasin clé/valeur en mémoire,
// suffisant pour tester du code lisant/écrivant des fichiers via `File`/
// `Paths`, sans dépendre du système de fichiers natif (indisponible en
// Jest/Vitest). Stashé sur `globalThis` plutôt que capturé par une closure,
// car `jest.mock("expo-file-system", () => ...)` interdit de référencer une
// variable hors-scope dans sa factory — `getFakeExpoFileSystem()` récupère
// l'instance après coup, une fois le mock enregistré.
export function createFakeExpoFileSystem(): FakeExpoFileSystem {
  const store = new Map<string, string>();

  class File implements FakeFile {
    uri: string;
    constructor(...parts: (string | { uri: string })[]) {
      this.uri = parts
        .map((p) => (typeof p === "string" ? p : p.uri))
        .join("/");
    }
    get exists() {
      return store.has(this.uri);
    }
    create() {
      store.set(this.uri, "");
    }
    write(content: string) {
      store.set(this.uri, content);
    }
    delete() {
      store.delete(this.uri);
    }
    text() {
      const content = store.get(this.uri);
      if (content === undefined) {
        return Promise.reject(new Error(`Fake file not found: ${this.uri}`));
      }
      return Promise.resolve(content);
    }
  }

  const fakeFs: FakeExpoFileSystem = {
    store,
    File,
    Paths: { cache: { uri: "cache" }, document: { uri: "document" } },
  };
  (globalThis as Record<string, unknown>)[GLOBAL_KEY] = fakeFs;
  return fakeFs;
}

export function getFakeExpoFileSystem(): FakeExpoFileSystem {
  const fakeFs = (globalThis as Record<string, unknown>)[GLOBAL_KEY] as
    FakeExpoFileSystem | undefined;
  if (!fakeFs) {
    throw new Error(
      "getFakeExpoFileSystem() called before createFakeExpoFileSystem() ran.",
    );
  }
  return fakeFs;
}
