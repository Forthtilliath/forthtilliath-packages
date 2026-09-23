// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { compressImage } from "./compressImage.js";

// jsdom neither decodes images nor implements canvas, so both are faked:
// setting `src` fires onload (or onerror) with the configured natural size.
let imageSize = { width: 1000, height: 500 };
let imageLoads = true;

class FakeImage {
  naturalWidth = 0;
  naturalHeight = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_url: string) {
    this.naturalWidth = imageSize.width;
    this.naturalHeight = imageSize.height;
    queueMicrotask(() => (imageLoads ? this.onload?.() : this.onerror?.()));
  }
}

const drawImage = vi.fn();
let context: { drawImage: typeof drawImage } | null = { drawImage };
let blob: Blob | null = new Blob(["webp"], { type: "image/webp" });
// Typed like HTMLCanvasElement.toBlob so the (type, quality) args are recorded.
const toBlob = vi.fn<HTMLCanvasElement["toBlob"]>((callback) => {
  callback(blob);
});
const createObjectURL = vi.fn(() => "blob:mock");
const revokeObjectURL = vi.fn();

beforeEach(() => {
  imageSize = { width: 1000, height: 500 };
  imageLoads = true;
  context = { drawImage };
  blob = new Blob(["webp"], { type: "image/webp" });
  vi.stubGlobal("Image", FakeImage);
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(toBlob);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  drawImage.mockClear();
  toBlob.mockClear();
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  Reflect.deleteProperty(URL, "createObjectURL");
  Reflect.deleteProperty(URL, "revokeObjectURL");
});

const png = () => new File(["png"], "photo.png", { type: "image/png" });

describe("compressImage", () => {
  it("returns non-image files unchanged", async () => {
    const pdf = new File(["%PDF"], "doc.pdf", { type: "application/pdf" });
    await expect(compressImage(pdf)).resolves.toBe(pdf);
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("converts to a .webp file and revokes the object URL", async () => {
    const result = await compressImage(png());
    expect(result.name).toBe("photo.webp");
    expect(result.type).toBe("image/webp");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    expect(toBlob.mock.calls[0]?.slice(1)).toEqual(["image/webp", 0.82]);
  });

  it("keeps the original size when narrower than maxWidth", async () => {
    await compressImage(png());
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1000, 500);
  });

  it("scales down to maxWidth, keeping the aspect ratio", async () => {
    imageSize = { width: 4000, height: 3000 };
    await compressImage(png(), { maxWidth: 2000, quality: 0.5 });
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 2000, 1500);
    expect(toBlob.mock.calls[0]?.[2]).toBe(0.5);
  });

  it("rejects when the image can't be loaded", async () => {
    imageLoads = false;
    await expect(compressImage(png())).rejects.toThrow("Failed to load image");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });

  it("rejects when no 2D context is available", async () => {
    context = null;
    await expect(compressImage(png())).rejects.toThrow(
      "Canvas 2D context is not supported",
    );
  });

  it("rejects when the canvas yields no blob", async () => {
    blob = null;
    await expect(compressImage(png())).rejects.toThrow(
      "Image compression failed",
    );
  });
});
