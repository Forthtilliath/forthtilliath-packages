type PathPart = string | { uri: string };

export interface FakeFile {
  uri: string;
  exists: boolean;
  create: () => void;
  write: (content: string) => void;
  delete: () => void;
  text: () => Promise<string>;
  textSync: () => string;
}

export interface FakeDirectory {
  uri: string;
  /** Created, one of the `Paths` roots, or holding a file. */
  exists: boolean;
  create: () => void;
  /** Removes the directory and everything under it. */
  delete: () => void;
}

export interface FakeExpoFileSystem {
  store: Map<string, string>;
  File: new (...parts: PathPart[]) => FakeFile;
  Directory: new (...parts: PathPart[]) => FakeDirectory;
  Paths: { cache: FakeDirectory; document: FakeDirectory };
  /**
   * Set to `true` to simulate a full disk: `File#create`/`write` then throw
   * ("Fake disk full") and leave the store untouched.
   */
  failWrites: boolean;
  /** Empties the store, forgets created directories, resets `failWrites`. */
  reset: () => void;
}

export interface FakeExpoFileSystemOptions {
  /**
   * URI of `Paths.document`, e.g. `"file:///documents"` for code that checks
   * the scheme. @defaultValue "document"
   */
  documentUri?: string;
  /** URI of `Paths.cache`. @defaultValue "cache" */
  cacheUri?: string;
}

const GLOBAL_KEY = "__forthtilliathFakeExpoFileSystem";

/** Joins like expo-file-system: one `/` between parts, none doubled. */
function joinUri(parts: PathPart[]): string {
  return parts
    .map((part) => (typeof part === "string" ? part : part.uri))
    .reduce((uri, part) => (uri.endsWith("/") ? uri + part : `${uri}/${part}`));
}

// Double léger d'expo-file-system : un simple magasin clé/valeur en mémoire,
// suffisant pour tester du code lisant/écrivant des fichiers via `File`/
// `Directory`/`Paths`, sans dépendre du système de fichiers natif
// (indisponible en Jest/Vitest). Stashé sur `globalThis` plutôt que capturé
// par une closure, car `jest.mock("expo-file-system", () => ...)` interdit de
// référencer une variable hors-scope dans sa factory —
// `getFakeExpoFileSystem()` récupère l'instance après coup, une fois le mock
// enregistré.
export function createFakeExpoFileSystem({
  documentUri = "document",
  cacheUri = "cache",
}: FakeExpoFileSystemOptions = {}): FakeExpoFileSystem {
  const store = new Map<string, string>();
  const directories = new Set<string>();
  const roots = new Set([documentUri, cacheUri]);

  function assertWritable() {
    if (fakeFs.failWrites) throw new Error("Fake disk full");
  }

  class File implements FakeFile {
    uri: string;
    constructor(...parts: PathPart[]) {
      this.uri = joinUri(parts);
    }
    get exists() {
      return store.has(this.uri);
    }
    create() {
      assertWritable();
      store.set(this.uri, "");
    }
    write(content: string) {
      assertWritable();
      store.set(this.uri, content);
    }
    delete() {
      store.delete(this.uri);
    }
    text() {
      return Promise.resolve().then(() => this.textSync());
    }
    textSync() {
      const content = store.get(this.uri);
      if (content === undefined) {
        throw new Error(`Fake file not found: ${this.uri}`);
      }
      return content;
    }
  }

  class Directory implements FakeDirectory {
    uri: string;
    constructor(...parts: PathPart[]) {
      this.uri = joinUri(parts);
    }
    private get prefix() {
      return this.uri.endsWith("/") ? this.uri : `${this.uri}/`;
    }
    get exists() {
      if (roots.has(this.uri) || directories.has(this.uri)) return true;
      return [...store.keys()].some((uri) => uri.startsWith(this.prefix));
    }
    create() {
      directories.add(this.uri);
    }
    delete() {
      for (const uri of [...store.keys()]) {
        if (uri.startsWith(this.prefix)) store.delete(uri);
      }
      for (const uri of [...directories]) {
        if (uri === this.uri || uri.startsWith(this.prefix)) {
          directories.delete(uri);
        }
      }
    }
  }

  const fakeFs: FakeExpoFileSystem = {
    store,
    File,
    Directory,
    Paths: {
      cache: new Directory(cacheUri),
      document: new Directory(documentUri),
    },
    failWrites: false,
    reset() {
      store.clear();
      directories.clear();
      fakeFs.failWrites = false;
    },
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
