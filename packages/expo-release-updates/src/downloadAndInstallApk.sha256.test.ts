import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  fakes,
  GITHUB_APK,
  mockDownloadTask,
  resetFakes,
  SHA_A,
  SHA_B,
} from "./testing/fakeApkDownload.js";

vi.mock("expo-file-system", async () =>
  (await import("./testing/fakeApkDownload.js")).expoFileSystemModule(),
);
vi.mock("expo-intent-launcher", async () =>
  (await import("./testing/fakeApkDownload.js")).intentLauncherModule(),
);

const { downloadAndInstallApk } = await import("./downloadAndInstallApk.js");

const download = { contentUri: "content://downloads/app.apk" };

beforeEach(resetFakes);

describe("downloadAndInstallApk: expectedSha256", () => {
  it("installs when the SHA-256 matches, whatever its form", async () => {
    mockDownloadTask(download);

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
      expectedSha256: `sha256:${SHA_A.toUpperCase()}`,
    });

    expect(fakes.digest).toHaveBeenCalledWith("SHA-256");
    expect(fakes.startActivityAsync).toHaveBeenCalled();
    expect(fakes.deleteDownloadedFile).not.toHaveBeenCalled();
  });

  it("deletes the file and throws when the SHA-256 doesn't match", async () => {
    mockDownloadTask(download);

    await expect(
      downloadAndInstallApk({
        apkUrl: GITHUB_APK,
        fileName: "app-update.apk",
        expectedSha256: SHA_B,
      }),
    ).rejects.toThrow("APK SHA-256 mismatch");
    expect(fakes.deleteDownloadedFile).toHaveBeenCalledTimes(1);
    expect(fakes.startActivityAsync).not.toHaveBeenCalled();
  });

  it("refuses a malformed SHA-256 before downloading", async () => {
    mockDownloadTask(download);

    await expect(
      downloadAndInstallApk({
        apkUrl: GITHUB_APK,
        fileName: "app-update.apk",
        expectedSha256: "abc",
      }),
    ).rejects.toThrow("Invalid expectedSha256");
    expect(fakes.createDownloadTask).not.toHaveBeenCalled();
  });

  it("refuses to install without File#digest (expo-file-system < 58)", async () => {
    mockDownloadTask(download, undefined, { withDigest: false });

    await expect(
      downloadAndInstallApk({
        apkUrl: GITHUB_APK,
        fileName: "app-update.apk",
        expectedSha256: SHA_A,
      }),
    ).rejects.toThrow("expo-file-system 58");
    expect(fakes.deleteDownloadedFile).toHaveBeenCalledTimes(1);
    expect(fakes.startActivityAsync).not.toHaveBeenCalled();
  });
});

describe("downloadAndInstallApk: allowedUrlPrefix", () => {
  const prefix = "https://github.com/acme/app/releases/download/";

  it("accepts a file under the prefix", async () => {
    mockDownloadTask(download);

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
      allowedUrlPrefix: prefix,
    });

    expect(fakes.startActivityAsync).toHaveBeenCalled();
  });

  it.each([
    ["another repo", "https://github.com/evil/app/releases/download/v1/x.apk"],
    ["a .. segment", `${prefix}../../../evil/app/releases/download/v1/x.apk`],
    ["a query", `${prefix}v1/app.apk?x=1`],
    ["an escape", `${prefix}v1/%2e%2e/app.apk`],
    ["the bare prefix", prefix],
  ])("refuses %s without downloading anything", async (_case, apkUrl) => {
    mockDownloadTask(download);

    await expect(
      downloadAndInstallApk({
        apkUrl,
        fileName: "app-update.apk",
        allowedUrlPrefix: prefix,
      }),
    ).rejects.toThrow("Refusing to download the APK");
    expect(fakes.createDownloadTask).not.toHaveBeenCalled();
  });
});
