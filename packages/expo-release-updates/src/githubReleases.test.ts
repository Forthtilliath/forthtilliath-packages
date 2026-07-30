import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchLatestRelease, fetchReleaseHistory } from "./githubReleases.js";

const ref = { owner: "acme", repo: "app" };

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("fetchLatestRelease", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the version, notes and apk url of the latest release", async () => {
    mockFetchOnce({
      tag_name: "v1.2.3",
      body: "### Added\n- Stuff",
      assets: [
        {
          name: "app-release.apk",
          browser_download_url: "https://example.com/app.apk",
        },
      ],
    });

    const release = await fetchLatestRelease(ref);
    expect(release).toEqual({
      version: "1.2.3",
      notes: "### Added\n- Stuff",
      apkUrl: "https://example.com/app.apk",
    });
  });

  it("requests the /releases/latest endpoint for the given owner/repo", async () => {
    const fetchMock = mockFetchOnce({ tag_name: "v1.0.0", assets: [] });
    await fetchLatestRelease(ref);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/app/releases/latest",
      expect.objectContaining({
        headers: { Accept: "application/vnd.github+json" },
      }),
    );
  });

  it("returns null when the release has no .apk asset", async () => {
    mockFetchOnce({ tag_name: "v1.2.3", assets: [{ name: "source.zip" }] });
    expect(await fetchLatestRelease(ref)).toBeNull();
  });

  it("throws if the GitHub API request fails", async () => {
    mockFetchOnce({}, false, 404);
    await expect(fetchLatestRelease(ref)).rejects.toThrow(
      "GitHub responded with 404",
    );
  });
});

describe("fetchReleaseHistory", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps each release to version/notes/publishedAt", async () => {
    mockFetchOnce([
      {
        tag_name: "v2.0.0",
        body: "notes 2",
        published_at: "2026-02-01T00:00:00.000Z",
      },
      {
        tag_name: "v1.0.0",
        body: "notes 1",
        published_at: "2026-01-01T00:00:00.000Z",
      },
    ]);

    const history = await fetchReleaseHistory(ref);
    expect(history).toEqual([
      {
        version: "2.0.0",
        notes: "notes 2",
        publishedAt: "2026-02-01T00:00:00.000Z",
      },
      {
        version: "1.0.0",
        notes: "notes 1",
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("passes the limit through as per_page", async () => {
    const fetchMock = mockFetchOnce([]);
    await fetchReleaseHistory({ ...ref, limit: 3 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/app/releases?per_page=3",
      expect.anything(),
    );
  });

  it("defaults to a limit of 10", async () => {
    const fetchMock = mockFetchOnce([]);
    await fetchReleaseHistory(ref);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/app/releases?per_page=10",
      expect.anything(),
    );
  });

  it("throws if the GitHub API request fails", async () => {
    mockFetchOnce({}, false, 500);
    await expect(fetchReleaseHistory(ref)).rejects.toThrow(
      "GitHub responded with 500",
    );
  });
});
