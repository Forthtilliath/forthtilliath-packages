import { Directory, File, Paths } from "expo-file-system";

import { randomId } from "@forthtilliath/ts-kit/id/randomId";

// Files the app keeps for good (photos, avatars...): pickers and exports hand
// back URIs in a cache folder the OS may empty at any time, so anything worth
// keeping is copied into a sub-folder of the app's documents.

// Folder names, prefixes and extensions end up in a path, and callers may
// build them from imported data (a restored backup): only plain name
// characters get through — no "..", no way out of the documents folder.
const SAFE_NAME = /^[\w-]+$/;
const SAFE_FOLDER = /^[\w-]+(\/[\w-]+)*$/;

function assertSafe(value: string, pattern: RegExp, what: string): string {
  if (!pattern.test(value)) {
    throw new Error(`Invalid ${what}: ${JSON.stringify(value)}`);
  }
  return value;
}

/** Last segment of a URI, i.e. the file name. */
function fileNameOf(uri: string): string {
  return uri.slice(uri.lastIndexOf("/") + 1);
}

/**
 * The app's persistent sub-folder `name` (in documents), created on first use.
 * `name` is made of letters, digits, `_`, `-`, and `/` between nested folders.
 *
 * @throws if `name` holds any other character (`..`, a leading `/`…).
 */
export function getAppDirectory(name: string): Directory {
  const directory = new Directory(
    Paths.document,
    assertSafe(name, SAFE_FOLDER, "folder name"),
  );
  if (!directory.exists)
    directory.create({ intermediates: true, idempotent: true });
  return directory;
}

/**
 * Extension of a file URI, query string ignored — `fallback` when it has none
 * (picker URIs don't always carry one).
 */
export function getFileExtension(uri: string, fallback = "jpg"): string {
  const match = uri.split("?")[0]?.match(/\.(\w+)$/);
  return match?.[1] ?? fallback;
}

export interface PersistFileOptions {
  /** Persistent sub-folder, see `getAppDirectory`. */
  directory: string;
  /** Start of the new file name (letters, digits, `_`, `-`), followed by a timestamp. */
  prefix: string;
}

/**
 * Copies a temporary file (picker result, download) into the persistent
 * sub-folder and returns the copy's URI, to store instead of the original.
 */
export async function persistFile(
  sourceUri: string,
  { directory, prefix }: PersistFileOptions,
): Promise<string> {
  const destination = new File(
    getAppDirectory(directory),
    `${assertSafe(prefix, SAFE_NAME, "prefix")}-${Date.now()}.${getFileExtension(sourceUri)}`,
  );
  await new File(sourceUri).copy(destination);
  return destination.uri;
}

export interface WriteBase64FileOptions extends PersistFileOptions {
  /** @defaultValue "jpg" */
  extension?: string;
}

/**
 * Writes base64 content (a photo embedded in a JSON backup…) as a new file of
 * the persistent sub-folder and returns its URI. Names are random rather than
 * timestamped: a restore writes many files within the same millisecond.
 *
 * @throws if `directory`, `prefix` or `extension` isn't a plain name (see
 * {@link getAppDirectory}).
 */
export function writeBase64File(
  base64: string,
  { directory, prefix, extension = "jpg" }: WriteBase64FileOptions,
): string {
  const file = new File(
    getAppDirectory(directory),
    `${assertSafe(prefix, SAFE_NAME, "prefix")}-${randomId()}.${assertSafe(extension, SAFE_NAME, "extension")}`,
  );
  file.create();
  file.write(base64, { encoding: "base64" });
  return file.uri;
}

/**
 * Content of a file as base64 (to embed it in a JSON backup), `null` when it
 * can't be read — a photo the OS already cleared from its cache, a bad URI.
 */
export function readFileBase64(uri: string): string | null {
  try {
    return new File(uri).base64Sync();
  } catch {
    return null;
  }
}

/** Whether a file exists at `uri`; `false` for a malformed URI instead of throwing. */
export function fileExists(uri: string): boolean {
  try {
    return new File(uri).exists;
  } catch {
    return false;
  }
}

/**
 * Deletes a file if it is still there, best effort: an absent file or a failed
 * deletion never makes the caller fail.
 */
export function deleteFileQuietly(uri: string | null | undefined): void {
  if (!uri) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Nothing to do: a leftover file is harmless.
  }
}

/**
 * Deletes every file of the persistent sub-folder that isn't in `keep`
 * (replaced photo, deleted entity, data replaced by an import). Returns how
 * many files were deleted.
 *
 * Files are matched by **name**, not by full URI: Android reaches the same
 * file as `/data/user/0/<package>/…` or `/data/data/<package>/…` depending on
 * the API that built the URI — compared as a whole, a stored URI in the other
 * form would get its photo deleted.
 */
export function pruneAppDirectory(
  name: string,
  keep: Iterable<string>,
): number {
  const kept = new Set(Array.from(keep, fileNameOf));
  let deleted = 0;
  for (const entry of getAppDirectory(name).list()) {
    if (entry instanceof File && !kept.has(fileNameOf(entry.uri))) {
      try {
        entry.delete();
        deleted += 1;
      } catch {
        // Retried on the next prune.
      }
    }
  }
  return deleted;
}
