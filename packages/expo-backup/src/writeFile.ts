import type { File } from "expo-file-system";

type WriteArgs = Parameters<File["write"]>;

/** `File` as seen across SDKs: `write` is async and `writeSync` exists since expo-file-system 58. */
interface AnySdkFile {
  write: (...args: WriteArgs) => unknown;
  writeSync?: (...args: WriteArgs) => void;
}

/**
 * Writes and waits for the end of the write, so that a failure rejects here
 * and nothing reads the file too early: `File.write` returns a promise since
 * expo-file-system 58 (`void` before).
 * @internal
 */
export async function writeFileAsync(
  file: File,
  ...args: WriteArgs
): Promise<void> {
  await (file as AnySdkFile).write(...args);
}

/**
 * Synchronous write on every SDK: `writeSync` since expo-file-system 58,
 * `write` (synchronous then) before.
 * @internal
 */
export function writeFileSync(file: File, ...args: WriteArgs): void {
  const anySdkFile = file as AnySdkFile;
  if (anySdkFile.writeSync) anySdkFile.writeSync(...args);
  else anySdkFile.write(...args);
}
