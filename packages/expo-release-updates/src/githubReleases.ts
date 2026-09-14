export interface GithubRepoRef {
  owner: string;
  repo: string;
  /**
   * A GitHub personal access token (or `GITHUB_TOKEN` in CI), sent as a
   * `Bearer` token. Required for private repos; also raises the API rate
   * limit from 60 to 5000 requests/hour for public ones.
   */
  token?: string;
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
  published_at?: string;
  assets?: GithubApiReleaseAsset[];
}

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
 * Fetches the latest GitHub release for a repo, along with its `.apk` asset.
 *
 * @returns `null` if the latest release has no `.apk` asset attached.
 * @throws if the GitHub API request fails.
 */
export async function fetchLatestRelease(
  ref: GithubRepoRef,
): Promise<LatestRelease | null> {
  const response = await fetch(`${releasesUrl(ref)}/latest`, {
    headers: githubHeaders(ref),
  });
  if (!response.ok)
    throw new Error(`GitHub responded with ${String(response.status)}`);

  const data = (await response.json()) as GithubApiRelease;
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
 * Fetches the most recent releases for a repo (version, notes, publish
 * date), most recent first — useful for a "release history" screen.
 */
export async function fetchReleaseHistory(
  ref: GithubRepoRef & { limit?: number },
): Promise<ReleaseHistoryEntry[]> {
  const { limit = 10 } = ref;
  const response = await fetch(
    `${releasesUrl(ref)}?per_page=${String(limit)}`,
    { headers: githubHeaders(ref) },
  );
  if (!response.ok)
    throw new Error(`GitHub responded with ${String(response.status)}`);

  const data = (await response.json()) as GithubApiRelease[];
  return data.map((release) => ({
    version: (release.tag_name ?? "").replace(/^v/, ""),
    notes: release.body ?? "",
    publishedAt: release.published_at ?? "",
  }));
}
