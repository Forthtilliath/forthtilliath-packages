import { File, Paths } from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

/**
 * Android's `Intent.FLAG_GRANT_READ_URI_PERMISSION`: lets the package
 * installer read the APK through its `content://` URI.
 */
const FLAG_GRANT_READ_URI_PERMISSION = 1;

const DEFAULT_ALLOWED_HOSTS = ["github.com"];

/**
 * Host of an `https://` URL, lowercased — or `null` for any other scheme, or
 * a URL with credentials (`https://github.com@evil.example/`). Parsed by hand:
 * React Native's `URL` doesn't implement `hostname`.
 */
function httpsHost(url: string): string | null {
  const match = /^https:\/\/([^/?#:@]+)(?::\d+)?(?:[/?#]|$)/i.exec(url);
  return match?.[1]?.toLowerCase() ?? null;
}

export interface DownloadAndInstallApkOptions {
  apkUrl: string;
  /** Temp filename in the cache directory, e.g. "myapp-update.apk". */
  fileName: string;
  onProgress?: (fraction: number) => void;
  /**
   * MD5 checksum the downloaded file is expected to match (case-insensitive),
   * e.g. one published alongside the release. When set, a mismatch deletes
   * the file and rejects instead of installing it. This catches a corrupted
   * or truncated download — not a malicious release: whoever can publish the
   * APK can publish its checksum too. Android's own check that an update is
   * signed with the same key as the installed app is what guards against that.
   */
  expectedMd5?: string;
  /**
   * Hosts `apkUrl` may point to — `["github.com"]` by default, the host of
   * the `apkUrl` returned by `fetchLatestRelease` (GitHub then redirects to
   * its own download host). Any other host, or a non-`https://` URL, is
   * rejected before downloading anything.
   */
  allowedHosts?: string[];
}

/**
 * Downloads an APK to the cache directory and triggers the Android
 * install-package intent. Android only — there is no equivalent flow on iOS,
 * which doesn't allow installing a downloaded package outside the App Store.
 *
 * @throws if `apkUrl` isn't an `https://` URL on one of `allowedHosts`, if
 * the download fails, or if `expectedMd5` is set and doesn't match the
 * downloaded file.
 */
export async function downloadAndInstallApk({
  apkUrl,
  fileName,
  onProgress,
  expectedMd5,
  allowedHosts = DEFAULT_ALLOWED_HOSTS,
}: DownloadAndInstallApkOptions): Promise<void> {
  const host = httpsHost(apkUrl);
  if (
    !host ||
    !allowedHosts.some((allowed) => allowed.toLowerCase() === host)
  ) {
    throw new Error(
      `Refusing to download the APK from ${apkUrl}: expected an https:// URL on ${allowedHosts.join(", ")}.`,
    );
  }

  const destination = new File(Paths.cache, fileName);
  if (destination.exists) destination.delete();

  const task = File.createDownloadTask(apkUrl, destination, {
    onProgress: ({ bytesWritten, totalBytes }) => {
      if (totalBytes > 0) onProgress?.(bytesWritten / totalBytes);
    },
  });
  const file = await task.downloadAsync();
  if (!file) throw new Error("The download failed.");

  if (expectedMd5) {
    const actualMd5 = file.info({ md5: true }).md5;
    if (actualMd5?.toLowerCase() !== expectedMd5.toLowerCase()) {
      file.delete();
      throw new Error(
        `APK checksum mismatch: expected ${expectedMd5}, got ${actualMd5 ?? "none"}.`,
      );
    }
  }

  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: file.contentUri,
    flags: FLAG_GRANT_READ_URI_PERMISSION,
    type: "application/vnd.android.package-archive",
  });
}
