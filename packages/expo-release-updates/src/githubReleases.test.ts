import { afterEach, describe, expect, it, vi } from "vitest";

import { createMockResponse } from "@forthtilliath/test-kit/createMockResponse";

import { fetchLatestRelease, fetchReleaseHistory } from "./githubReleases.js";

const ref = { owner: "acme", repo: "app" };

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(createMockResponse(body, { ok, status }));
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

  it("sends a bearer token when provided, for private repos and higher rate limits", async () => {
    const fetchMock = mockFetchOnce({ tag_name: "v1.0.0", assets: [] });
    await fetchLatestRelease({ ...ref, token: "gh-token" });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer gh-token",
        },
      }),
    );
  });

  it("omits the Authorization header when no token is provided", async () => {
    const fetchMock = mockFetchOnce({ tag_name: "v1.0.0", assets: [] });
    await fetchLatestRelease(ref);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: { Accept: "application/vnd.github+json" },
      }),
    );
  });
});

describe("timeout and cancellation", () => {
  // A fetch that never answers on its own, only rejects once aborted (right
  // away for an already-aborted signal, like the real one).
  function mockHangingFetch() {
    const fetchMock = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          const abort = () => {
            reject(new DOMException("Aborted", "AbortError"));
          };
          if (init?.signal?.aborted) abort();
          init?.signal?.addEventListener("abort", abort);
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("gives up after 15 s by default", async () => {
    vi.useFakeTimers();
    mockHangingFetch();
    const pending = fetchLatestRelease(ref);
    const assertion = expect(pending).rejects.toThrow(
      "GitHub did not respond within 15000 ms",
    );
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
  });

  it("honors a custom timeoutMs", async () => {
    vi.useFakeTimers();
    mockHangingFetch();
    const pending = fetchReleaseHistory({ ...ref, timeoutMs: 1000 });
    const assertion = expect(pending).rejects.toThrow(
      "GitHub did not respond within 1000 ms",
    );
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it("aborts when the caller's signal aborts, without a timeout message", async () => {
    mockHangingFetch();
    const controller = new AbortController();
    const pending = fetchLatestRelease({ ...ref, signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toThrow("Aborted");
  });

  it("doesn't even start waiting when the signal is already aborted", async () => {
    const fetchMock = mockHangingFetch();
    const pending = fetchLatestRelease({ ...ref, signal: AbortSignal.abort() });
    await expect(pending).rejects.toThrow("Aborted");
    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
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

  it("leaves draft releases out", async () => {
    mockFetchOnce([
      { tag_name: "v3.0.0", draft: true, published_at: null },
      { tag_name: "v2.0.0", draft: false, published_at: "2026-02-01" },
    ]);
    const history = await fetchReleaseHistory(ref);
    expect(history.map((entry) => entry.version)).toEqual(["2.0.0"]);
  });

  it("clamps the limit to GitHub's 1–100 per_page range", async () => {
    const fetchMock = mockFetchOnce([]);
    await fetchReleaseHistory({ ...ref, limit: 500 });
    await fetchReleaseHistory({ ...ref, limit: 0 });
    expect(fetchMock.mock.calls[0]?.[0]).toContain("per_page=100");
    expect(fetchMock.mock.calls[1]?.[0]).toContain("per_page=1");
  });

  it("sends a bearer token when provided", async () => {
    const fetchMock = mockFetchOnce([]);
    await fetchReleaseHistory({ ...ref, token: "gh-token" });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer gh-token",
        },
      }),
    );
  });
});
