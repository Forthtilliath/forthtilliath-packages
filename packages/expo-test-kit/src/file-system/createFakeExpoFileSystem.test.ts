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

describe("getFakeExpoFileSystem", () => {
  beforeEach(() => {
    createFakeExpoFileSystem();
  });

  it("returns the most recently created fake file system", () => {
    const created = createFakeExpoFileSystem();
    expect(getFakeExpoFileSystem()).toBe(created);
  });
});
