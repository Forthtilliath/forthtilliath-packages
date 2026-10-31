type PathPart = string | { uri: string };

/**
 * A fake `File` of `expo-file-system` (the object API of SDK 54+), backed by
 * the in-memory store.
 */
export interface FakeFile {
  /**
   * The path parts joined with `/` (a `{ uri }` part, such as `Paths.document`,
   * contributes its `uri`).
   */
  uri: string;
  /** Whether the store holds content for `uri`. */
  exists: boolean;
  /**
   * Creates the file empty (overwriting any content). Throws "Fake disk full"
   * when `failWrites` is on.
   */
  create: () => void;
  /** Replaces the content. Throws "Fake disk full" when `failWrites` is on. */
  write: (content: string) => void;
  /** Removes the file; no-op when absent. */
  delete: () => void;
  /**
   * Resolves the content; rejects with "Fake file not found: <uri>" when
   * absent.
   */
  text: () => Promise<string>;
  /** Returns the content; throws "Fake file not found: <uri>" when absent. */
  textSync: () => string;
}

/**
 * A fake `Directory` of `expo-file-system`: it has no content of its own, only
 * a prefix for the files under it.
 */
export interface FakeDirectory {
  /** The path parts joined with `/`. */
  uri: string;
  /** Created, one of the `Paths` roots, or holding a file. */
  exists: boolean;
  /**
   * Marks the directory as created (so `exists` is `true` even while empty).
   */
  create: () => void;
  /** Removes the directory and everything under it. */
  delete: () => void;
}

/**
 * The fake module returned by {@link createFakeExpoFileSystem}: hand it to
 * `jest.mock("expo-file-system", …)` / `vi.mock`, then inspect `store` in the
 * test.
 */
export interface FakeExpoFileSystem {
  /** Every file, by URI → content. Seed or inspect it directly. */
  store: Map<string, string>;
  /** Fake `File` class: `new File(Paths.document, "backup.json")`. */
  File: new (...parts: PathPart[]) => FakeFile;
  /** Fake `Directory` class: `new Directory(Paths.cache, "exports")`. */
  Directory: new (...parts: PathPart[]) => FakeDirectory;
  /** The two roots apps use, always existing. */
  Paths: { cache: FakeDirectory; document: FakeDirectory };
  /**
   * Set to `true` to simulate a full disk: `File#create`/`write` then throw
   * ("Fake disk full") and leave the store untouched.
   */
  failWrites: boolean;
  /** Empties the store, forgets created directories, resets `failWrites`. */
  reset: () => void;
}

/** Options of {@link createFakeExpoFileSystem}. */
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
/**
 * Creates an in-memory stand-in for the `File` / `Directory` / `Paths` API of
 * `expo-file-system`, to test code that reads and writes files without a
 * device. The instance is also stored on `globalThis`, so a module factory
 * (hoisted above the test's variables) can reach it with {@link
 * getFakeExpoFileSystem}.
 * @param options - The URIs of the two roots.
 * @returns The fake module, with its `store`, a `failWrites` switch and
 *   `reset`.
 * @example
 * jest.mock("expo-file-system", () => createFakeExpoFileSystem());
 * const fs = getFakeExpoFileSystem();
 * beforeEach(() => fs.reset());
 * // … run the code, then:
 * expect(fs.store.get("document/backup.json")).toContain('"version"');
 */
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

/**
 * Returns the instance the last {@link createFakeExpoFileSystem} call created —
 * from a test body, when the fake was created inside a hoisted `jest.mock` /
 * `vi.mock` factory.
 * @returns The current fake file system.
 * @throws When no fake was created yet.
 */
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
