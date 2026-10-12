import { beforeEach, describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({
  manipulated: [] as string[],
  resize: vi.fn(),
  save: vi.fn<(options: unknown) => Promise<{ base64?: string }>>(),
}));

vi.mock("expo-image-manipulator", () => ({
  SaveFormat: { JPEG: "jpeg" },
  ImageManipulator: {
    manipulate(uri: string) {
      calls.manipulated.push(uri);
      const context = {
        resize(size: unknown) {
          calls.resize(size);
          return context;
        },
        renderAsync: () => Promise.resolve({ saveAsync: calls.save }),
      };
      return context;
    },
  },
}));

const writeBase64File = vi.hoisted(() =>
  vi.fn(() => "file:///documents/avatars/avatar-1.jpg"),
);
vi.mock("./appFiles.js", () => ({ writeBase64File }));

const { saveImageThumbnail } = await import("./imageThumbnail.js");

beforeEach(() => {
  calls.manipulated.length = 0;
  calls.resize.mockReset();
  calls.save.mockReset().mockResolvedValue({ base64: "AAAA" });
  writeBase64File.mockClear();
});

describe("saveImageThumbnail", () => {
  it("resizes, compresses to JPEG and keeps it in the folder", async () => {
    const uri = await saveImageThumbnail("file:///cache/picked.png", {
      directory: "avatars",
      prefix: "avatar",
    });

    expect(uri).toBe("file:///documents/avatars/avatar-1.jpg");
    expect(calls.manipulated).toEqual(["file:///cache/picked.png"]);
    expect(calls.resize).toHaveBeenCalledWith({ width: 256 });
    expect(calls.save).toHaveBeenCalledWith({
      base64: true,
      compress: 0.8,
      format: "jpeg",
    });
    expect(writeBase64File).toHaveBeenCalledWith("AAAA", {
      directory: "avatars",
      prefix: "avatar",
      extension: "jpg",
    });
  });

  it("takes a custom width and quality", async () => {
    await saveImageThumbnail("file:///x.jpg", {
      directory: "d",
      prefix: "p",
      width: 128,
      quality: 0.5,
    });
    expect(calls.resize).toHaveBeenCalledWith({ width: 128 });
    expect(calls.save).toHaveBeenCalledWith(
      expect.objectContaining({ compress: 0.5 }),
    );
  });

  it("rejects an empty result", async () => {
    calls.save.mockResolvedValue({});
    await expect(
      saveImageThumbnail("file:///x.jpg", { directory: "d", prefix: "p" }),
    ).rejects.toThrow("Empty image");
    expect(writeBase64File).not.toHaveBeenCalled();
  });
});
