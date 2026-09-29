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
}

export interface ReleaseHistoryEntry {
  version: string;
  notes: string;
  publishedAt: string;
}

interface GithubApiReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GithubApiRelease {
  tag_name?: string;
  body?: string;
  published_at?: string | null;
  draft?: boolean;
  assets?: GithubApiReleaseAsset[];
}

const DEFAULT_TIMEOUT_MS = 15_000;
/** GitHub's own max for `per_page`. */
const MAX_PER_PAGE = 100;

function releasesUrl({ owner, repo }: GithubRepoRef): string {
  return `https://api.github.com/repos/${owner}/${repo}/releases`;
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
 * Fetches the latest GitHub release for a repo, along with its `.apk` asset.
 *
 * @returns `null` if the latest release has no `.apk` asset attached.
 * @throws if the GitHub API request fails or times out.
 */
export async function fetchLatestRelease(
  ref: GithubRepoRef,
): Promise<LatestRelease | null> {
  const data = await fetchGithubJson<GithubApiRelease>(
    `${releasesUrl(ref)}/latest`,
    ref,
  );
  const apkAsset = (data.assets ?? []).find((asset) =>
    asset.name.endsWith(".apk"),
  );
  if (!apkAsset) return null;

  return {
    version: (data.tag_name ?? "").replace(/^v/, ""),
    notes: data.body ?? "",
    apkUrl: apkAsset.browser_download_url,
  };
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
  const data = await fetchGithubJson<GithubApiRelease[]>(
    `${releasesUrl(ref)}?per_page=${String(perPage)}`,
    ref,
  );
  return data
    .filter((release) => !release.draft)
    .map((release) => ({
      version: (release.tag_name ?? "").replace(/^v/, ""),
      notes: release.body ?? "",
      publishedAt: release.published_at ?? "",
    }));
}
