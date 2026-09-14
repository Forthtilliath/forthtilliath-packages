import { describe, expect, it } from "vitest";

import { createInMemoryFileSystem } from "./createInMemoryFileSystem.js";

describe("createInMemoryFileSystem", () => {
  it("starts empty when no initial files are given", () => {
    const fakeFs = createInMemoryFileSystem();
    expect(fakeFs.exists("/a.txt")).toBe(false);
  });

  it("seeds initial files, readable right away", async () => {
    const fakeFs = createInMemoryFileSystem({ "/config.json": "{}" });
    expect(fakeFs.exists("/config.json")).toBe(true);
    await expect(fakeFs.readFile("/config.json")).resolves.toBe("{}");
  });

  it("writeFile() then readFile() round-trips the content", async () => {
    const fakeFs = createInMemoryFileSystem();
    await fakeFs.writeFile("/note.txt", "hello");
    await expect(fakeFs.readFile("/note.txt")).resolves.toBe("hello");
  });

  it("readFile() rejects for a path that was never written", async () => {
    const fakeFs = createInMemoryFileSystem();
    await expect(fakeFs.readFile("/missing.txt")).rejects.toThrow(
      "File not found: /missing.txt",
    );
  });

  it("deleteFile() removes the file", async () => {
    const fakeFs = createInMemoryFileSystem({ "/note.txt": "hi" });
    await fakeFs.deleteFile("/note.txt");
    expect(fakeFs.exists("/note.txt")).toBe(false);
  });

  it("reset() clears every file, optionally reseeding", async () => {
    const fakeFs = createInMemoryFileSystem({ "/a.txt": "a" });
    fakeFs.reset({ "/b.txt": "b" });
    expect(fakeFs.exists("/a.txt")).toBe(false);
    await expect(fakeFs.readFile("/b.txt")).resolves.toBe("b");
  });

  it("exposes the underlying store for direct inspection", async () => {
    const fakeFs = createInMemoryFileSystem();
    await fakeFs.writeFile("/note.txt", "hi");
    expect(fakeFs.files.get("/note.txt")).toBe("hi");
  });
});
