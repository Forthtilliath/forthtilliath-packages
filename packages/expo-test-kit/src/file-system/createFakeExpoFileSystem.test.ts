import { beforeEach, describe, expect, it } from "vitest";

import {
  createFakeExpoFileSystem,
  getFakeExpoFileSystem,
} from "./createFakeExpoFileSystem.js";

describe("createFakeExpoFileSystem", () => {
  it("creates a file that doesn't exist until create()/write() is called", () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.cache, "note.txt");

    expect(file.exists).toBe(false);
    file.create();
    expect(file.exists).toBe(true);
  });

  it("write() then text() round-trips the content", async () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.document, "note.txt");

    file.write("hello");
    await expect(file.text()).resolves.toBe("hello");
  });

  it("text() throws for a file that was never created", async () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.cache, "missing.txt");

    await expect(file.text()).rejects.toThrow("Fake file not found");
  });

  it("delete() removes the file", () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.cache, "note.txt");

    file.create();
    file.delete();
    expect(file.exists).toBe(false);
  });

  it("two File instances pointing at the same path share the same content (via store)", () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.cache, "note.txt");
    file.write("hi");

    expect(fakeFs.store.get("cache/note.txt")).toBe("hi");
  });
});

describe("createFakeExpoFileSystem: sync reads and failing writes", () => {
  it("textSync() returns the content, or throws for a missing file", () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.document, "note.txt");
    expect(() => file.textSync()).toThrow("Fake file not found");
    file.write("hello");
    expect(file.textSync()).toBe("hello");
  });

  it("failWrites makes create() and write() throw, leaving the store as is", () => {
    const fakeFs = createFakeExpoFileSystem();
    const file = new fakeFs.File(fakeFs.Paths.document, "note.txt");
    file.write("before");
    fakeFs.failWrites = true;

    expect(() => {
      file.write("after");
    }).toThrow("Fake disk full");
    expect(() => {
      new fakeFs.File(fakeFs.Paths.document, "other.txt").create();
    }).toThrow("Fake disk full");
    expect(file.textSync()).toBe("before");
  });

  it("reset() empties the store and turns failWrites off", () => {
    const fakeFs = createFakeExpoFileSystem();
    new fakeFs.File(fakeFs.Paths.cache, "note.txt").write("hi");
    fakeFs.failWrites = true;
    fakeFs.reset();
    expect(fakeFs.store.size).toBe(0);
    expect(fakeFs.failWrites).toBe(false);
  });
});

describe("createFakeExpoFileSystem: directories and paths", () => {
  it("a directory exists once created, as a root, or when it holds a file", () => {
    const fakeFs = createFakeExpoFileSystem();
    const backups = new fakeFs.Directory(fakeFs.Paths.document, "backups");
    expect(fakeFs.Paths.document.exists).toBe(true);
    expect(backups.exists).toBe(false);

    backups.create();
    expect(backups.exists).toBe(true);

    const photos = new fakeFs.Directory(fakeFs.Paths.document, "photos");
    new fakeFs.File(photos, "a.jpg").write("…");
    expect(photos.exists).toBe(true);
  });

  it("delete() removes the directory and its files", () => {
    const fakeFs = createFakeExpoFileSystem();
    const backups = new fakeFs.Directory(fakeFs.Paths.document, "backups");
    backups.create();
    const file = new fakeFs.File(backups, "1.json");
    file.write("{}");
    new fakeFs.File(fakeFs.Paths.document, "backups-index.json").write("[]");

    backups.delete();
    expect(backups.exists).toBe(false);
    expect(file.exists).toBe(false);
    expect([...fakeFs.store.keys()]).toEqual(["document/backups-index.json"]);
  });

  it("takes full root URIs, without doubling slashes", () => {
    const fakeFs = createFakeExpoFileSystem({
      documentUri: "file:///documents/",
      cacheUri: "file:///cache",
    });
    expect(new fakeFs.File(fakeFs.Paths.document, "a.txt").uri).toBe(
      "file:///documents/a.txt",
    );
    expect(new fakeFs.File(fakeFs.Paths.cache, "b.txt").uri).toBe(
      "file:///cache/b.txt",
    );
  });
});

describe("getFakeExpoFileSystem", () => {
  beforeEach(() => {
    createFakeExpoFileSystem();
  });

  it("returns the most recently created fake file system", () => {
    const created = createFakeExpoFileSystem();
    expect(getFakeExpoFileSystem()).toBe(created);
  });
});
