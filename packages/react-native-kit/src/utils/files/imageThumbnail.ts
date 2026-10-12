import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { type PersistFileOptions, writeBase64File } from "./appFiles.js";

export interface SaveImageThumbnailOptions extends PersistFileOptions {
  /** Width in pixels, height keeps the ratio. @defaultValue 256 */
  width?: number;
  /** JPEG quality, 0 to 1. @defaultValue 0.8 */
  quality?: number;
}

/**
 * Shrinks a picked photo to a JPEG thumbnail and keeps it in the app's
 * persistent sub-folder (see `getAppDirectory`); returns its URI. Small
 * enough to embed as base64 in a JSON backup (`readFileBase64`) and recreate
 * on restore (`writeBase64File`). Needs `expo-image-manipulator` and
 * `expo-file-system`.
 *
 * @example
 * const avatarUri = await saveImageThumbnail(pickedUri, {
 *   directory: "avatars",
 *   prefix: "avatar",
 * });
 */
export async function saveImageThumbnail(
  sourceUri: string,
  { width = 256, quality = 0.8, ...target }: SaveImageThumbnailOptions,
): Promise<string> {
  const image = await ImageManipulator.manipulate(sourceUri)
    .resize({ width })
    .renderAsync();
  const result = await image.saveAsync({
    base64: true,
    compress: quality,
    format: SaveFormat.JPEG,
  });
  if (!result.base64) throw new Error("Empty image");
  return writeBase64File(result.base64, { ...target, extension: "jpg" });
}
