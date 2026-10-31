/**
 * The fake file system returned by {@link createInMemoryFileSystem}. Paths are
 * plain map keys: no directories, no normalization.
 */
export interface InMemoryFileSystem {
  /** The underlying store — inspect or seed it directly if needed. */
  files: Map<string, string>;
  /** Whether a file is stored at `path`. */
  exists: (path: string) => boolean;
  /**
   * Resolves the content stored at `path`; rejects with `Error("File not found:
   * <path>")` when there is none.
   */
  readFile: (path: string) => Promise<string>;
  /** Stores `content` at `path`, replacing any previous content. */
  writeFile: (path: string, content: string) => Promise<void>;
  /** Removes the file at `path`. */
  deleteFile: (path: string) => Promise<void>;
  /**
   * Clears every file, optionally reseeding with a fresh set — handy in a
   * `beforeEach`.
   */
  reset: (initialFiles?: Record<string, string>) => void;
}

/**
 * A minimal in-memory file system — enough to test code that reads/writes
 * files by path (e.g. via `node:fs/promises`) without touching the real
 * disk. Framework-agnostic sibling of `@forthtilliath/expo-test-kit`'s
 * `createFakeExpoFileSystem`, which fakes `expo-file-system`'s specific
 * `File`/`Paths` shape instead of a generic path/content API.
 *
 * @example
 * const fakeFs = createInMemoryFileSystem({ "/config.json": "{}" });
 * vi.mock("node:fs/promises", () => fakeFs);
 */
export function createInMemoryFileSystem(
  initialFiles: Record<string, string> = {},
): InMemoryFileSystem {
  const files = new Map<string, string>(Object.entries(initialFiles));

  return {
    files,
    exists(path) {
      return files.has(path);
    },
    readFile(path) {
      const content = files.get(path);
      if (content === undefined) {
        return Promise.reject(new Error(`File not found: ${path}`));
      }
      return Promise.resolve(content);
    },
    writeFile(path, content) {
      files.set(path, content);
      return Promise.resolve();
    },
    deleteFile(path) {
      files.delete(path);
      return Promise.resolve();
    },
    reset(newInitialFiles = {}) {
      files.clear();
      for (const [path, content] of Object.entries(newInitialFiles)) {
        files.set(path, content);
      }
    },
  };
}
