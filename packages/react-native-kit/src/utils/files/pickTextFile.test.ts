import { beforeEach, describe, expect, it, vi } from "vitest";

interface FakeFile {
  name: string;
  size: number;
  handleSize?: number | null;
  content: string;
  unreadable?: boolean;
}

const picker: { next: FakeFile | null | Error } = { next: null };
const read = vi.fn();

vi.mock("expo-file-system", () => ({
  File: {
    pickFileAsync: vi.fn((options: unknown) => {
      read(options);
      const next = picker.next;
      if (next instanceof Error) return Promise.reject(next);
      if (next === null)
        return Promise.resolve({ canceled: true, result: null });
      return Promise.resolve({
        canceled: false,
        result: {
          name: next.name,
          size: next.size,
          open: () => ({ size: next.handleSize ?? null, close: vi.fn() }),
          text: () =>
            next.unreadable
              ? Promise.reject(new Error("EACCES"))
              : Promise.resolve(next.content),
        },
      });
    }),
  },
}));

const { pickTextFile } = await import("./pickTextFile.js");

describe("pickTextFile", () => {
  beforeEach(() => {
    picker.next = null;
    read.mockClear();
  });

  it("returns null when the user cancels", async () => {
    await expect(pickTextFile()).resolves.toBeNull();
  });

  it("reads the chosen file, offering JSON-friendly types by default", async () => {
    picker.next = { name: "sauvegarde.json", size: 12, content: '{"a":1}' };
    await expect(pickTextFile()).resolves.toEqual({
      ok: true,
      text: '{"a":1}',
      name: "sauvegarde.json",
    });
    expect(read).toHaveBeenCalledWith({
      mimeTypes: ["application/json", "text/plain", "application/octet-stream"],
    });
  });

  it("refuses a file over maxBytes without reading it", async () => {
    // Reading would fail ("unreadable"): "too-large" proves it never happened.
    picker.next = {
      name: "x.json",
      size: 2_000_001,
      content: "",
      unreadable: true,
    };
    const result = await pickTextFile({ maxBytes: 2_000_000 });
    expect(result).toEqual({
      ok: false,
      reason: "too-large",
      error: "Fichier trop volumineux (2 Mo maximum).\nRien n'a été modifié.",
    });
  });

  it("asks the open handle when the picker reports no size", async () => {
    picker.next = { name: "x.json", size: 0, handleSize: 900, content: "{}" };
    await expect(
      pickTextFile({ maxBytes: 500, locale: "en" }),
    ).resolves.toEqual({
      ok: false,
      reason: "too-large",
      error: "File too large (1 KB at most).\nNothing was changed.",
    });
  });

  it("checks the length read when no size is known at all", async () => {
    picker.next = { name: "x.json", size: 0, content: "x".repeat(1_500_001) };
    const result = await pickTextFile({ maxBytes: 1_500_000 });
    expect(result).toMatchObject({
      reason: "too-large",
      error: "Fichier trop volumineux (1,5 Mo maximum).\nRien n'a été modifié.",
    });
  });

  it("reports an unreadable file or a picker failure", async () => {
    picker.next = { name: "x.json", size: 10, content: "", unreadable: true };
    await expect(pickTextFile()).resolves.toMatchObject({
      ok: false,
      reason: "unreadable",
    });
    picker.next = new Error("no activity");
    await expect(
      pickTextFile({ labels: { unreadable: "Oups" } }),
    ).resolves.toEqual({
      ok: false,
      reason: "unreadable",
      error: "Oups",
    });
  });

  it("passes custom MIME types", async () => {
    picker.next = { name: "a.csv", size: 3, content: "a;b" };
    await pickTextFile({ mimeTypes: ["text/csv"] });
    expect(read).toHaveBeenCalledWith({ mimeTypes: ["text/csv"] });
  });
});
