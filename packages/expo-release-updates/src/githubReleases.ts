import { compareVersions } from "./compareVersions.js";

export interface GithubRepoRef {
  owner: string;
  repo: string;
  /**
   * A GitHub token, sent as a `Bearer` token. Required for private repos;
   * also raises the API rate limit from 60 to 5000 requests/hour for public
   * ones. **Anything bundled in an app can be extracted from the APK**: only
   * ever ship a fine-grained, read-only token scoped to this one repo.
   */
  token?: string;
  /**
   * Gives up (rejects) if GitHub hasn't answered within this delay, instead
   * of leaving the check hanging on a bad network. Defaults to 15 s.
   */
  timeoutMs?: number;
  /** Aborts the request (e.g. when the screen that asked for it unmounts). */
  signal?: AbortSignal;
}

export interface LatestRelease {
  version: string;
  notes: string;
  apkUrl: string;
  /**
   * SHA-256 of the `.apk` (64 lowercase hex digits), as computed by GitHub
   * when the asset was uploaded — pass it to `downloadAndInstallApk`'s
   * `expectedSha256`. Missing for assets uploaded before GitHub computed
   * digests (mid-2025).
   */
  apkSha256?: string;
}

export interface FetchLatestReleaseOptions extends GithubRepoRef {
  /**
   * Also consider pre-releases. GitHub's `/releases/latest` only ever returns
   * a stable release, so an app that only publishes pre-releases (alpha,
   * beta) would never see an update: with this flag, the most recent
   * releases are scanned instead and the highest version carrying an `.apk`
   * wins. Defaults to `false`.
   */
  includePrereleases?: boolean;
}

export interface ReleaseHistoryEntry {
  version: string;
  notes: string;
  publishedAt: string;
}

interface GithubApiReleaseAsset {
  name?: unknown;
  browser_download_url?: unknown;
  digest?: unknown;
}

// External data: every field is checked before use rather than trusted.
interface GithubApiRelease {
  tag_name?: unknown;
  body?: unknown;
  published_at?: unknown;
  draft?: unknown;
  assets?: unknown;
}

const DEFAULT_TIMEOUT_MS = 15_000;
/** GitHub's own max for `per_page`. */
const MAX_PER_PAGE = 100;
/** Enough to skip a few releases without an APK (notes only, drafts). */
const PRERELEASE_SCAN = 10;
const SHA256_DIGEST = /^sha256:([0-9a-f]{64})$/i;

function releasesUrl({ owner, repo }: GithubRepoRef): string {
  return `https://api.github.com/repos/${owner}/${repo}/releases`;
}

/**
 * `https://github.com/<owner>/<repo>/releases/download/` — where every asset
 * of this repo's releases lives. Pass it to `downloadAndInstallApk`'s
 * `allowedUrlPrefix` so only an APK of this very repo can be installed.
 */
export function releaseDownloadUrlPrefix({ owner, repo }: GithubRepoRef) {
  return `https://github.com/${owner}/${repo}/releases/download/`;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function releasesIn(data: unknown): GithubApiRelease[] {
  return Array.isArray(data) ? data.filter(isObject) : [];
}

function versionOf(release: GithubApiRelease): string {
  return text(release.tag_name).replace(/^v/, "");
}

function apkOf(
  release: GithubApiRelease,
): Pick<LatestRelease, "apkUrl" | "apkSha256"> | null {
  const assets: GithubApiReleaseAsset[] = Array.isArray(release.assets)
    ? release.assets.filter(isObject)
    : [];
  const apk = assets.find(
    (asset) =>
      text(asset.name).endsWith(".apk") &&
      text(asset.browser_download_url) !== "",
  );
  if (!apk) return null;
  const sha256 = SHA256_DIGEST.exec(text(apk.digest))?.[1]?.toLowerCase();
  return {
    apkUrl: text(apk.browser_download_url),
    ...(sha256 ? { apkSha256: sha256 } : {}),
  };
}

function toLatestRelease(release: GithubApiRelease): LatestRelease | null {
  const apk = apkOf(release);
  if (!apk) return null;
  return { version: versionOf(release), notes: text(release.body), ...apk };
}

function githubHeaders({ token }: GithubRepoRef): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * GETs a GitHub API URL and parses its JSON body, rejecting on an error
 * status or once `timeoutMs` has elapsed (body download included).
 */
async function fetchGithubJson<T>(url: string, ref: GithubRepoRef): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal } = ref;
  const controller = new AbortController();
  // An object rather than `abort(reason)`: some React Native AbortController
  // polyfills drop the reason.
  const timeout = { expired: false };
  const timer = setTimeout(() => {
    timeout.expired = true;
    controller.abort();
  }, timeoutMs);
  const abortFromCaller = () => {
    controller.abort();
  };
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", abortFromCaller);

  try {
    const response = await fetch(url, {
      headers: githubHeaders(ref),
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(`GitHub responded with ${String(response.status)}`);
    return (await response.json()) as T;
  } catch (error) {
    if (timeout.expired) {
      throw new Error(`GitHub did not respond within ${String(timeoutMs)} ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}

/**
 * Fetches the latest GitHub release for a repo, along with its `.apk` asset
 * and the SHA-256 GitHub computed for it. Stable releases only, unless
 * `includePrereleases` is set.
 *
 * @returns `null` if the latest release has no `.apk` asset attached (with
 * `includePrereleases`: if none of the 10 most recent releases has one).
 * @throws if the GitHub API request fails or times out.
 */
export async function fetchLatestRelease(
  options: FetchLatestReleaseOptions,
): Promise<LatestRelease | null> {
  if (!options.includePrereleases) {
    const data = await fetchGithubJson<unknown>(
      `${releasesUrl(options)}/latest`,
      options,
    );
    return isObject(data) ? toLatestRelease(data) : null;
  }

  const data = await fetchGithubJson<unknown>(
    `${releasesUrl(options)}?per_page=${String(PRERELEASE_SCAN)}`,
    options,
  );
  let latest: LatestRelease | null = null;
  for (const release of releasesIn(data)) {
    if (release.draft === true) continue;
    const candidate = toLatestRelease(release);
    if (
      candidate &&
      (!latest || compareVersions(candidate.version, latest.version) > 0)
    ) {
      latest = candidate;
    }
  }
  return latest;
}

/**
 * Fetches the most recent published releases for a repo (version, notes,
 * publish date), most recent first — useful for a "release history" screen.
 * Draft releases (only visible with a token) are left out.
 */
export async function fetchReleaseHistory(
  ref: GithubRepoRef & { limit?: number },
): Promise<ReleaseHistoryEntry[]> {
  const { limit = 10 } = ref;
  const perPage = Math.min(Math.max(Math.trunc(limit), 1), MAX_PER_PAGE);
  const data = await fetchGithubJson<unknown>(
    `${releasesUrl(ref)}?per_page=${String(perPage)}`,
    ref,
  );
  return releasesIn(data)
    .filter((release) => release.draft !== true)
    .map((release) => ({
      version: versionOf(release),
      notes: text(release.body),
      publishedAt: text(release.published_at),
    }));
}
