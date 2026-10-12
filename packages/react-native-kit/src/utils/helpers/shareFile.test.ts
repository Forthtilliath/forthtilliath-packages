import { beforeEach, describe, expect, it, vi } from "vitest";

const sharing = vi.hoisted(() => ({
  isAvailableAsync: vi.fn<() => Promise<boolean>>(),
  shareAsync: vi.fn<(uri: string, options: unknown) => Promise<void>>(),
}));
vi.mock("expo-sharing", () => sharing);

const written = vi.hoisted(
  () => [] as { uri: string; content: string; deleted: boolean }[],
);
vi.mock("expo-file-system", () => ({
  Paths: { cache: { uri: "file:///cache" } },
  File: class {
    uri: string;
    exists: boolean;
    constructor(dir: { uri: string }, name: string) {
      this.uri = `${dir.uri}/${name}`;
      this.exists = name === "old.ics";
    }
    delete() {
      written.push({ uri: this.uri, content: "", deleted: true });
    }
    create() {
      // created empty, then written
    }
    write(content: string) {
      written.push({ uri: this.uri, content, deleted: false });
    }
  },
}));

const { shareFile } = await import("./shareFile.js");
const { shareTextFile } = await import("./shareTextFile.js");

beforeEach(() => {
  sharing.isAvailableAsync.mockReset().mockResolvedValue(true);
  sharing.shareAsync.mockReset().mockResolvedValue(undefined);
  written.length = 0;
});

describe("shareFile", () => {
  it("opens the share sheet with the MIME type and title", async () => {
    await shareFile("file:///x.png", {
      mimeType: "image/png",
      dialogTitle: "Partager",
    });
    expect(sharing.shareAsync).toHaveBeenCalledWith("file:///x.png", {
      mimeType: "image/png",
      dialogTitle: "Partager",
    });
  });

  it("throws a French message when sharing is unavailable, English with locale", async () => {
    sharing.isAvailableAsync.mockResolvedValue(false);
    await expect(shareFile("file:///x", { mimeType: "a/b" })).rejects.toThrow(
      "Le partage n'est pas disponible sur cet appareil.",
    );
    await expect(
      shareFile("file:///x", { mimeType: "a/b", locale: "en" }),
    ).rejects.toThrow("Sharing isn't available on this device.");
    await expect(
      shareFile("file:///x", { mimeType: "a/b", unavailableMessage: "Nope" }),
    ).rejects.toThrow("Nope");
    expect(sharing.shareAsync).not.toHaveBeenCalled();
  });
});

describe("shareTextFile", () => {
  it("writes the text to the cache, then shares that file", async () => {
    await shareTextFile("planning.ics", "BEGIN:VCALENDAR", {
      mimeType: "text/calendar",
    });
    expect(written).toEqual([
      {
        uri: "file:///cache/planning.ics",
        content: "BEGIN:VCALENDAR",
        deleted: false,
      },
    ]);
    expect(sharing.shareAsync).toHaveBeenCalledWith(
      "file:///cache/planning.ics",
      expect.objectContaining({ mimeType: "text/calendar" }),
    );
  });

  it("replaces a previous file of the same name", async () => {
    await shareTextFile("old.ics", "new", { mimeType: "text/calendar" });
    expect(written.map((w) => w.deleted)).toEqual([true, false]);
  });
});
