/** One image of the icon, see {@link pngsToIco}. */
export interface IcoImage {
  /** Width and height in pixels (square), from 1 to 256. */
  size: number;
  /** The PNG file's bytes (a Node `Buffer` fits as is). */
  png: Uint8Array;
}

const HEADER_BYTES = 6;
const ENTRY_BYTES = 16;

/**
 * Packs square PNG images into one `.ico` file (a `favicon.ico` with 16, 32
 * and 48 px sizes…), without an image dependency: the PNGs are stored as
 * is, which every current browser and Windows accept.
 *
 * @param images - The sizes to include, each a square PNG.
 * @returns The `.ico` file's bytes.
 * @throws {RangeError} When `images` is empty or a size isn't an integer from 1 to 256.
 * @example
 * const sizes = [16, 32, 48];
 * const images = await Promise.all(
 *   sizes.map(async (size) => ({ size, png: await sharp(svg).resize(size).png().toBuffer() })),
 * );
 * writeFileSync("app/favicon.ico", pngsToIco(images));
 */
export function pngsToIco(images: readonly IcoImage[]): Uint8Array {
  if (images.length === 0) {
    throw new RangeError("pngsToIco needs at least one image");
  }
  for (const { size } of images) {
    if (!Number.isInteger(size) || size < 1 || size > 256) {
      throw new RangeError(
        `Icon size must be an integer from 1 to 256, got ${String(size)}`,
      );
    }
  }

  const dataStart = HEADER_BYTES + images.length * ENTRY_BYTES;
  const total = images.reduce(
    (bytes, { png }) => bytes + png.length,
    dataStart,
  );
  const ico = new Uint8Array(total);
  const view = new DataView(ico.buffer);

  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, images.length, true);

  let offset = dataStart;
  images.forEach(({ size, png }, index) => {
    const entry = HEADER_BYTES + index * ENTRY_BYTES;
    // 256 px is written as 0, the format's one byte can't hold it.
    view.setUint8(entry, size % 256);
    view.setUint8(entry + 1, size % 256);
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, png.length, true);
    view.setUint32(entry + 12, offset, true);
    ico.set(png, offset);
    offset += png.length;
  });

  return ico;
}
