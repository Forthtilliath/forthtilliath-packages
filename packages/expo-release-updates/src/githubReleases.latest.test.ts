import { afterEach, describe, expect, it, vi } from "vitest";

import { createMockResponse } from "@forthtilliath/test-kit/createMockResponse";

import {
  fetchLatestRelease,
  releaseDownloadUrlPrefix,
} from "./githubReleases.js";

const ref = { owner: "acme", repo: "app" };
const SHA = "ab".repeat(32);

function mockFetch(body: unknown) {
  const fetchMock = vi
    .fn()
    .mockImplementation(() => Promise.resolve(createMockResponse(body)));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function apk(version: string, digest?: string) {
  return {
    name: `App-${version}.apk`,
    browser_download_url: `https://github.com/acme/app/releases/download/v${version}/App-${version}.apk`,
    ...(digest === undefined ? {} : { digest }),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchLatestRelease: apkSha256", () => {
  it("returns the SHA-256 GitHub computed for the apk, lowercased", async () => {
    mockFetch({
      tag_name: "v1.0.0",
      assets: [apk("1.0.0", `sha256:${SHA.toUpperCase()}`)],
    });
    expect((await fetchLatestRelease(ref))?.apkSha256).toBe(SHA);
  });

  it("leaves it out when GitHub gave none, or another algorithm", async () => {
    mockFetch({ tag_name: "v1.0.0", assets: [apk("1.0.0")] });
    expect(await fetchLatestRelease(ref)).not.toHaveProperty("apkSha256");

    mockFetch({ tag_name: "v1.0.0", assets: [apk("1.0.0", "md5:abc")] });
    expect(await fetchLatestRelease(ref)).not.toHaveProperty("apkSha256");
  });

  it("ignores malformed fields instead of throwing", async () => {
    mockFetch({ tag_name: 42, body: null, assets: [null, { name: 3 }] });
    expect(await fetchLatestRelease(ref)).toBeNull();

    mockFetch(null);
    expect(await fetchLatestRelease(ref)).toBeNull();
  });
});

describe("fetchLatestRelease: includePrereleases", () => {
  it("scans the recent releases instead of /releases/latest", async () => {
    const fetchMock = mockFetch([]);
    await fetchLatestRelease({ ...ref, includePrereleases: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/app/releases?per_page=10",
      expect.anything(),
    );
  });

  it("returns the highest version with an apk, pre-releases included", async () => {
    mockFetch([
      { tag_name: "v1.0.0-alpha.9", draft: true, assets: [apk("1.0.0")] },
      { tag_name: "v1.0.0-alpha.3", body: "notes", assets: [] },
      {
        tag_name: "v1.0.0-alpha.2",
        body: "alpha 2",
        assets: [apk("1.0.0-alpha.2", `sha256:${SHA}`)],
      },
      { tag_name: "v0.9.0", assets: [apk("0.9.0")] },
      { tag_name: "v1.0.0-alpha.10", assets: [apk("1.0.0-alpha.10")] },
    ]);

    const release = await fetchLatestRelease({
      ...ref,
      includePrereleases: true,
    });
    expect(release?.version).toBe("1.0.0-alpha.10");
  });

  it("returns null when no recent release has an apk", async () => {
    mockFetch([{ tag_name: "v1.0.0", assets: [] }, "junk"]);
    expect(
      await fetchLatestRelease({ ...ref, includePrereleases: true }),
    ).toBeNull();
  });
});

describe("releaseDownloadUrlPrefix", () => {
  it("is where the repo's release assets live", () => {
    expect(releaseDownloadUrlPrefix(ref)).toBe(
      "https://github.com/acme/app/releases/download/",
    );
    expect(apk("1.0.0").browser_download_url).toMatch(
      new RegExp(`^${releaseDownloadUrlPrefix(ref)}`),
    );
  });
});
