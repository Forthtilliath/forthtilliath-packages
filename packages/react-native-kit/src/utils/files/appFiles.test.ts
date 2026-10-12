import { beforeEach, describe, expect, it, vi } from "vitest";

// In-memory stand-in for expo-file-system: a set of existing file URIs and
// one of existing folder URIs, enough for File/Directory/Paths as used here.
const files = new Set<string>();
const folders = new Set<string>();
const undeletable = new Set<string>();
const contents = new Map<string, string>();

vi.mock("expo-file-system", () => {
  const join = (parent: string | { uri: string }, name?: string) => {
    const base = typeof parent === "string" ? parent : parent.uri;
    return name === undefined ? base : `${base}/${name}`;
  };

  class File {
    uri: string;
    constructor(parent: string | { uri: string }, name?: string) {
      this.uri = join(parent, name);
      if (this.uri.startsWith("bad:")) throw new Error("Invalid URI");
    }
    get exists() {
      return files.has(this.uri);
    }
    delete() {
      if (undeletable.has(this.uri)) throw new Error("Locked");
      files.delete(this.uri);
    }
    copy(destination: File) {
      if (!files.has(this.uri))
        return Promise.reject(new Error("Missing source"));
      files.add(destination.uri);
      return Promise.resolve();
    }
    create() {
      files.add(this.uri);
    }
    write(content: string) {
      contents.set(this.uri, content);
    }
    base64Sync() {
      if (!files.has(this.uri)) throw new Error("Missing file");
      return contents.get(this.uri) ?? "";
    }
  }

  class Directory {
    uri: string;
    constructor(parent: { uri: string }, name: string) {
      this.uri = join(parent, name);
    }
    get exists() {
      return folders.has(this.uri);
    }
    create() {
      folders.add(this.uri);
    }
    list() {
      return [...files]
        .filter((uri) => uri.startsWith(`${this.uri}/`))
        .map((uri) => new File(uri));
    }
  }

  return { File, Directory, Paths: { document: { uri: "file:///documents" } } };
});

const {
  deleteFileQuietly,
  fileExists,
  getAppDirectory,
  getFileExtension,
  persistFile,
  pruneAppDirectory,
  readFileBase64,
  writeBase64File,
} = await import("./appFiles.js");

beforeEach(() => {
  files.clear();
  folders.clear();
  undeletable.clear();
  contents.clear();
});

describe("writeBase64File / readFileBase64", () => {
  it("round-trips base64 content through a new file of the folder", () => {
    const uri = writeBase64File("AAAA", {
      directory: "avatars",
      prefix: "avatar",
    });
    expect(uri).toMatch(/^file:\/\/\/documents\/avatars\/avatar-.+\.jpg$/);
    expect(readFileBase64(uri)).toBe("AAAA");
  });

  it("names each file uniquely, with the given extension", () => {
    const options = { directory: "a", prefix: "p", extension: "png" };
    const first = writeBase64File("x", options);
    const second = writeBase64File("y", options);
    expect(first).not.toBe(second);
    expect(second.endsWith(".png")).toBe(true);
  });

  it("reads null from a missing file or a bad URI", () => {
    expect(readFileBase64("file:///cache/gone.jpg")).toBeNull();
    expect(readFileBase64("bad:uri")).toBeNull();
  });
});

describe("getFileExtension", () => {
  it("reads the extension, ignoring the query string", () => {
    expect(getFileExtension("file:///cache/photo.png?width=200")).toBe("png");
  });

  it("falls back when the URI has none", () => {
    expect(getFileExtension("content://media/42")).toBe("jpg");
    expect(getFileExtension("content://media/42", "bin")).toBe("bin");
  });
});

describe("getAppDirectory", () => {
  it("creates the sub-folder of documents on first use", () => {
    expect(getAppDirectory("photos").uri).toBe("file:///documents/photos");
    expect(folders.has("file:///documents/photos")).toBe(true);
  });
});

describe("persistFile", () => {
  it("copies the file into the persistent folder and returns the copy's URI", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1234);
    files.add("file:///cache/ImagePicker/x.jpeg");

    const uri = await persistFile("file:///cache/ImagePicker/x.jpeg", {
      directory: "foods",
      prefix: "food",
    });

    expect(uri).toBe("file:///documents/foods/food-1234.jpeg");
    expect(files.has(uri)).toBe(true);
  });

  it("rejects when the source has already been cleared", async () => {
    await expect(
      persistFile("file:///cache/gone.jpg", {
        directory: "foods",
        prefix: "food",
      }),
    ).rejects.toThrow("Missing source");
  });
});

describe("fileExists", () => {
  it("tells whether the file is there, false on a malformed URI", () => {
    files.add("file:///documents/a.jpg");
    expect(fileExists("file:///documents/a.jpg")).toBe(true);
    expect(fileExists("file:///documents/b.jpg")).toBe(false);
    expect(fileExists("bad:uri")).toBe(false);
  });
});

describe("deleteFileQuietly", () => {
  it("deletes an existing file", () => {
    files.add("file:///documents/a.jpg");
    deleteFileQuietly("file:///documents/a.jpg");
    expect(files.size).toBe(0);
  });

  it("never throws, whatever the URI", () => {
    undeletable.add("file:///documents/locked.jpg");
    files.add("file:///documents/locked.jpg");
    expect(() => {
      deleteFileQuietly("file:///documents/locked.jpg");
      deleteFileQuietly("file:///documents/missing.jpg");
      deleteFileQuietly("bad:uri");
      deleteFileQuietly(null);
      deleteFileQuietly(undefined);
    }).not.toThrow();
  });
});

describe("pruneAppDirectory", () => {
  it("deletes the files of the folder that aren't kept", () => {
    files.add("file:///documents/avatars/a.jpg");
    files.add("file:///documents/avatars/b.jpg");
    files.add("file:///documents/avatars/locked.jpg");
    files.add("file:///documents/other/c.jpg");
    undeletable.add("file:///documents/avatars/locked.jpg");

    const deleted = pruneAppDirectory("avatars", [
      "file:///documents/avatars/a.jpg",
    ]);

    expect(deleted).toBe(1);
    expect([...files].sort()).toEqual([
      "file:///documents/avatars/a.jpg",
      "file:///documents/avatars/locked.jpg",
      "file:///documents/other/c.jpg",
    ]);
  });
});
