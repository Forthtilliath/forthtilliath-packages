import { beforeEach, describe, expect, it, vi } from "vitest";

interface ProgressEvent {
  bytesWritten: number;
  totalBytes: number;
}

interface FakeDownloadTask {
  downloadAsync: () => Promise<{ contentUri: string } | undefined>;
}

type CreateDownloadTask = (
  url: string,
  destination: unknown,
  options: { onProgress: (event: ProgressEvent) => void },
) => FakeDownloadTask;

let fileExists = false;
const mockDelete = vi.fn();
const mockCreateDownloadTask = vi.fn<CreateDownloadTask>();

vi.mock("expo-file-system", () => {
  class FakeFile {
    uri: string;
    constructor(...parts: (string | { uri: string })[]) {
      this.uri = parts
        .map((p) => (typeof p === "string" ? p : p.uri))
        .join("/");
    }
    get exists() {
      return fileExists;
    }
    delete(): void {
      mockDelete();
    }
    static createDownloadTask(
      ...args: Parameters<CreateDownloadTask>
    ): FakeDownloadTask {
      return mockCreateDownloadTask(...args);
    }
  }
  return { File: FakeFile, Paths: { cache: { uri: "cache" } } };
});

const mockStartActivityAsync = vi.fn<(...args: unknown[]) => Promise<void>>();
vi.mock("expo-intent-launcher", () => ({
  startActivityAsync: (...args: unknown[]) => mockStartActivityAsync(...args),
}));

const { downloadAndInstallApk } = await import("./downloadAndInstallApk.js");

function mockDownloadTask(result: { contentUri: string } | undefined) {
  mockCreateDownloadTask.mockImplementation((_url, _dest, options) => ({
    downloadAsync: () => {
      options.onProgress({ bytesWritten: 50, totalBytes: 100 });
      return Promise.resolve(result);
    },
  }));
}

describe("downloadAndInstallApk", () => {
  beforeEach(() => {
    fileExists = false;
    mockDelete.mockClear();
    mockCreateDownloadTask.mockReset();
    mockStartActivityAsync.mockClear();
  });

  it("downloads the apk and triggers the Android install intent", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });

    await downloadAndInstallApk({
      apkUrl: "https://example.com/app.apk",
      fileName: "app-update.apk",
    });

    expect(mockCreateDownloadTask).toHaveBeenCalledWith(
      "https://example.com/app.apk",
      expect.objectContaining({ uri: "cache/app-update.apk" }),
      expect.anything(),
    );
    expect(mockStartActivityAsync).toHaveBeenCalledWith(
      "android.intent.action.VIEW",
      {
        data: "content://downloads/app.apk",
        flags: 1,
        type: "application/vnd.android.package-archive",
      },
    );
  });

  it("deletes a pre-existing file at the destination before downloading", async () => {
    fileExists = true;
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });

    await downloadAndInstallApk({
      apkUrl: "https://example.com/app.apk",
      fileName: "app-update.apk",
    });

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it("reports progress as a 0-1 fraction", async () => {
    mockDownloadTask({ contentUri: "content://downloads/app.apk" });
    const onProgress = vi.fn();

    await downloadAndInstallApk({
      apkUrl: "https://example.com/app.apk",
      fileName: "app-update.apk",
      onProgress,
    });

    expect(onProgress).toHaveBeenCalledWith(0.5);
  });

  it("throws if the download fails", async () => {
    mockDownloadTask(undefined);

    await expect(
      downloadAndInstallApk({
        apkUrl: "https://example.com/app.apk",
        fileName: "app-update.apk",
      }),
    ).rejects.toThrow("The download failed.");
    expect(mockStartActivityAsync).not.toHaveBeenCalled();
  });
});
