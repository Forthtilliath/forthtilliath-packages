import { File } from "expo-file-system";

import type { KitLocale } from "../../i18n/locale.js";

export interface PickTextFileLabels {
  /** `maxBytes` formatted ("10 Mo") is given to build the message. */
  tooLarge: (maxSize: string) => string;
  unreadable: string;
}

export interface PickTextFileOptions {
  /**
   * Types offered by the system picker. A `.json` file may be seen as any of
   * the three defaults depending on the device and the provider (Drive…).
   *
   * @defaultValue ["application/json", "text/plain", "application/octet-stream"]
   */
  mimeTypes?: string[];
  /**
   * Largest file accepted, checked **before** reading it: a huge file is
   * refused without being loaded into memory.
   *
   * @defaultValue 5_000_000 (5 MB)
   */
  maxBytes?: number;
  /** Language of the messages. @defaultValue "fr" */
  locale?: KitLocale;
  labels?: Partial<PickTextFileLabels>;
}

export type PickTextFileResult =
  | { ok: true; text: string; name: string }
  | { ok: false; reason: "too-large" | "unreadable"; error: string };

const defaultLabels: Record<KitLocale, PickTextFileLabels> = {
  fr: {
    tooLarge: (max) =>
      `Fichier trop volumineux (${max} maximum).\nRien n'a été modifié.`,
    unreadable: "Impossible de lire ce fichier.\nRien n'a été modifié.",
  },
  en: {
    tooLarge: (max) => `File too large (${max} at most).\nNothing was changed.`,
    unreadable: "This file can't be read.\nNothing was changed.",
  },
};

function formatSize(bytes: number, locale: KitLocale): string {
  const [value, unit] =
    bytes < 1_000_000
      ? [Math.max(1, Math.round(bytes / 1000)), locale === "fr" ? "Ko" : "KB"]
      : [Math.round(bytes / 100_000) / 10, locale === "fr" ? "Mo" : "MB"];
  const number =
    locale === "fr" ? String(value).replace(".", ",") : String(value);
  return `${number} ${unit}`;
}

/** Size in bytes, 0 if unknown: some providers report 0, the open handle may know. */
function fileSize(file: File): number {
  if (file.size > 0) return file.size;
  try {
    const handle = file.open();
    try {
      return handle.size ?? 0;
    } finally {
      handle.close();
    }
  } catch {
    return 0;
  }
}

/**
 * Opens the system file picker (local files, Drive, Downloads…) and reads the
 * chosen text file — straight from its `content://` URI, without copying it.
 * The size is checked before reading, and the length again after (for
 * providers that don't report a size). Pair it with `parseUntrustedJson`
 * (`@forthtilliath/ts-kit`) to validate the content.
 *
 * Needs `expo-file-system` (SDK 54+). Needs no storage permission.
 *
 * @param options - See {@link PickTextFileOptions}.
 * @returns `null` if the user cancels, else `{ ok: true, text, name }` or
 * `{ ok: false, reason, error }` with a message ready to show.
 * @example
 * const picked = await pickTextFile({ maxBytes: 2_000_000 });
 * if (!picked) return;
 * if (!picked.ok) return Alert.alert("Import impossible", picked.error);
 * const result = parseUntrustedJson(picked.text, backupSchema);
 */
export async function pickTextFile(
  options: PickTextFileOptions = {},
): Promise<PickTextFileResult | null> {
  const {
    mimeTypes = ["application/json", "text/plain", "application/octet-stream"],
    maxBytes = 5_000_000,
    locale = "fr",
  } = options;
  const labels = { ...defaultLabels[locale], ...options.labels };
  const unreadable = {
    ok: false,
    reason: "unreadable",
    error: labels.unreadable,
  } as const;
  const tooLarge = {
    ok: false,
    reason: "too-large",
    error: labels.tooLarge(formatSize(maxBytes, locale)),
  } as const;

  try {
    const picked = await File.pickFileAsync({ mimeTypes });
    if (picked.canceled) return null;
    const file = picked.result;
    if (fileSize(file) > maxBytes) return tooLarge;
    const text = await file.text();
    // Each character takes at least one byte: a longer text is a larger file.
    if (text.length > maxBytes) return tooLarge;
    return { ok: true, text, name: file.name };
  } catch {
    return unreadable;
  }
}
