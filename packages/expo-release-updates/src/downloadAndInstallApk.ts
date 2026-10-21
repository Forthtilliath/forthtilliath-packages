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

/**
 * Whether `url` is `prefix` followed by plain path segments only: letters,
 * digits, `.`, `_`, `-` — no `..` segment, query, fragment, `%`-escape or
 * `@` that could lead it out of the prefix.
 */
function isUnderPrefix(url: string, prefix: string): boolean {
  if (!url.startsWith(prefix)) return false;
  const rest = url.slice(prefix.length);
  return (
    /^[\w.-]+(\/[\w.-]+)*$/.test(rest) &&
    rest.split("/").every((segment) => segment !== "." && segment !== "..")
  );
}

const SHA256_HEX = /^[0-9a-f]{64}$/;

/** `"sha256:ABC…"` or `"abc…"` → `"abc…"`, or `null` if not a SHA-256. */
function normalizeSha256(value: string): string | null {
  const hex = value
    .trim()
    .replace(/^sha256:/i, "")
    .toLowerCase();
  return SHA256_HEX.test(hex) ? hex : null;
}

/** `File#digest`, from expo-file-system 58 on. */
interface DigestFile {
  digest?: (algorithm: "SHA-256") => Promise<string>;
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
   * SHA-256 the downloaded file must match — `apkSha256` from
   * `fetchLatestRelease`, computed by GitHub itself when the asset was
   * uploaded (`"sha256:…"` or bare hex, any case). A mismatch deletes the
   * file and rejects instead of installing it. Same limits as `expectedMd5`
   * against a malicious release, but SHA-256 can't be forged to match a
   * tampered file. Needs expo-file-system 58 or later (`File#digest`, native,
   * without loading the APK in JS); with an older one, it rejects.
   */
  expectedSha256?: string;
  /**
   * Hosts `apkUrl` may point to — `["github.com"]` by default, the host of
   * the `apkUrl` returned by `fetchLatestRelease` (GitHub then redirects to
   * its own download host). Any other host, or a non-`https://` URL, is
   * rejected before downloading anything.
   */
  allowedHosts?: string[];
  /**
   * The start `apkUrl` must have, e.g. `releaseDownloadUrlPrefix({ owner,
   * repo })` to only accept an APK of this repo's releases (any github.com
   * URL passes `allowedHosts`, another repo's included). After the prefix,
   * only plain path segments are allowed: no `..`, query, fragment or
   * `%`-escape.
   */
  allowedUrlPrefix?: string;
}

/**
 * Downloads an APK to the cache directory and triggers the Android
 * install-package intent. Android only — there is no equivalent flow on iOS,
 * which doesn't allow installing a downloaded package outside the App Store.
 *
 * @throws if `apkUrl` isn't an `https://` URL on one of `allowedHosts` (or
 * under `allowedUrlPrefix`), if `expectedSha256` isn't a SHA-256, if the
 * download fails, or if `expectedMd5` / `expectedSha256` is set and doesn't
 * match the downloaded file.
 */
export async function downloadAndInstallApk({
  apkUrl,
  fileName,
  onProgress,
  expectedMd5,
  expectedSha256,
  allowedHosts = DEFAULT_ALLOWED_HOSTS,
  allowedUrlPrefix,
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
  if (
    allowedUrlPrefix !== undefined &&
    !isUnderPrefix(apkUrl, allowedUrlPrefix)
  ) {
    throw new Error(
      `Refusing to download the APK from ${apkUrl}: expected a file under ${allowedUrlPrefix}.`,
    );
  }
  const sha256 =
    expectedSha256 === undefined ? undefined : normalizeSha256(expectedSha256);
  if (sha256 === null) {
    throw new Error(`Invalid expectedSha256: "${String(expectedSha256)}".`);
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

  if (sha256) {
    const { digest } = file as DigestFile;
    if (typeof digest !== "function") {
      file.delete();
      throw new Error(
        "expectedSha256 needs expo-file-system 58 or later (File#digest).",
      );
    }
    const actualSha256 = (await digest.call(file, "SHA-256")).toLowerCase();
    if (actualSha256 !== sha256) {
      file.delete();
      throw new Error(
        `APK SHA-256 mismatch: expected ${sha256}, got ${actualSha256}.`,
      );
    }
  }

  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: file.contentUri,
    flags: FLAG_GRANT_READ_URI_PERMISSION,
    type: "application/vnd.android.package-archive",
  });
}
