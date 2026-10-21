import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  fakes,
  GITHUB_APK,
  mockDownloadTask,
  resetFakes,
} from "./testing/fakeApkDownload.js";

vi.mock("expo-file-system", async () =>
  (await import("./testing/fakeApkDownload.js")).expoFileSystemModule(),
);
vi.mock("expo-intent-launcher", async () =>
  (await import("./testing/fakeApkDownload.js")).intentLauncherModule(),
);

const { downloadAndInstallApk } = await import("./downloadAndInstallApk.js");

describe("downloadAndInstallApk", () => {
  beforeEach(resetFakes);

  it("downloads the apk and triggers the Android install intent", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
    });

    expect(fakes.createDownloadTask).toHaveBeenCalledWith(
      GITHUB_APK,
      expect.objectContaining({ uri: "cache/app-update.apk" }),
      expect.anything(),
    );
    expect(fakes.startActivityAsync).toHaveBeenCalledWith(
      "android.intent.action.VIEW",
      {
        data: "content://downloads/app.apk",
        flags: 1,
        type: "application/vnd.android.package-archive",
      },
    );
  });

  it("deletes a pre-existing file at the destination before downloading", async () => {
    fakes.fileExists = true;
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
    });

    expect(fakes.deleteDestination).toHaveBeenCalledTimes(1);
  });

  it("reports progress as a 0-1 fraction", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });
    const onProgress = vi.fn();

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
      onProgress,
    });

    expect(onProgress).toHaveBeenCalledWith(0.5);
  });

  it("throws if the download fails", async () => {
    mockDownloadTask(undefined);

    await expect(
      downloadAndInstallApk({
        apkUrl: GITHUB_APK,
        fileName: "app-update.apk",
      }),
    ).rejects.toThrow("The download failed.");
    expect(fakes.startActivityAsync).not.toHaveBeenCalled();
  });

  it("installs when the downloaded file matches the expected md5", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" }, "abc123");

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
      expectedMd5: "ABC123",
    });

    expect(fakes.startActivityAsync).toHaveBeenCalled();
    expect(fakes.deleteDownloadedFile).not.toHaveBeenCalled();
  });

  it("deletes the file and throws when the md5 doesn't match", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" }, "abc123");

    await expect(
      downloadAndInstallApk({
        apkUrl: GITHUB_APK,
        fileName: "app-update.apk",
        expectedMd5: "def456",
      }),
    ).rejects.toThrow("APK checksum mismatch: expected def456, got abc123.");
    expect(fakes.deleteDownloadedFile).toHaveBeenCalledTimes(1);
    expect(fakes.startActivityAsync).not.toHaveBeenCalled();
  });

  it.each([
    ["a non-https URL", "http://github.com/acme/app/app.apk"],
    ["another host", "https://evil.example/app.apk"],
    ["a lookalike host", "https://github.com.evil.example/app.apk"],
    ["credentials before the host", "https://github.com@evil.example/app.apk"],
  ])("refuses %s without downloading anything", async (_case, apkUrl) => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });

    await expect(
      downloadAndInstallApk({ apkUrl, fileName: "app-update.apk" }),
    ).rejects.toThrow("Refusing to download the APK");
    expect(fakes.createDownloadTask).not.toHaveBeenCalled();
    expect(fakes.startActivityAsync).not.toHaveBeenCalled();
  });

  it("accepts a host listed in allowedHosts, case-insensitively", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });

    await downloadAndInstallApk({
      apkUrl: "https://Downloads.Example.com:8443/app.apk",
      fileName: "app-update.apk",
      allowedHosts: ["downloads.example.com"],
    });

    expect(fakes.startActivityAsync).toHaveBeenCalled();
  });

  it("skips the checksum check when expectedMd5 is not provided", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" }, undefined);

    await downloadAndInstallApk({
      apkUrl: GITHUB_APK,
      fileName: "app-update.apk",
    });

    expect(fakes.startActivityAsync).toHaveBeenCalled();
  });
});
