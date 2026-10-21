// Fakes for expo-file-system and expo-intent-launcher, shared by the
// downloadAndInstallApk test files. Each file wires them with
//   vi.mock("expo-file-system", async () =>
//     (await import("./testing/fakeApkDownload.js")).expoFileSystemModule());
import { type Mock, vi } from "vitest";

interface ProgressEvent {
  bytesWritten: number;
  totalBytes: number;
}

interface FakeDownloadedFile {
  contentUri: string;
  info: () => { md5?: string };
  delete: () => void;
  digest?: (algorithm: string) => Promise<string>;
}

interface FakeDownloadTask {
  downloadAsync: () => Promise<FakeDownloadedFile | undefined>;
}

type CreateDownloadTask = (
  url: string,
  destination: unknown,
  options: { onProgress: (event: ProgressEvent) => void },
) => FakeDownloadTask;

export const SHA_A = "a".repeat(64);
export const SHA_B = "b".repeat(64);
export const GITHUB_APK =
  "https://github.com/acme/app/releases/download/v1.0.0/app.apk";

export const fakes: {
  fileExists: boolean;
  deleteDestination: Mock<() => void>;
  deleteDownloadedFile: Mock<() => void>;
  createDownloadTask: Mock<CreateDownloadTask>;
  digest: Mock<(algorithm: string) => Promise<string>>;
  startActivityAsync: Mock<(...args: unknown[]) => Promise<void>>;
} = {
  /** Whether a file already sits at the download destination. */
  fileExists: false,
  deleteDestination: vi.fn(),
  deleteDownloadedFile: vi.fn(),
  createDownloadTask: vi.fn<CreateDownloadTask>(),
  digest: vi.fn<(algorithm: string) => Promise<string>>(),
  startActivityAsync: vi.fn<(...args: unknown[]) => Promise<void>>(),
};

export function resetFakes() {
  fakes.fileExists = false;
  fakes.deleteDestination.mockClear();
  fakes.deleteDownloadedFile.mockClear();
  fakes.createDownloadTask.mockReset();
  fakes.digest.mockReset().mockResolvedValue(SHA_A);
  fakes.startActivityAsync.mockClear();
}

/** The next download resolves to `result` (`undefined`: a failed download). */
export function mockDownloadTask(
  result: { contentUri: string } | undefined,
  md5: string | undefined = "abc123",
  { withDigest = true } = {},
) {
  fakes.createDownloadTask.mockImplementation((_url, _dest, options) => ({
    downloadAsync: () => {
      options.onProgress({ bytesWritten: 50, totalBytes: 100 });
      return Promise.resolve(
        result && {
          ...result,
          info: () => ({ md5 }),
          delete: fakes.deleteDownloadedFile,
          ...(withDigest ? { digest: fakes.digest } : {}),
        },
      );
    },
  }));
}

export function expoFileSystemModule() {
  class FakeFile {
    uri: string;
    constructor(...parts: (string | { uri: string })[]) {
      this.uri = parts
        .map((p) => (typeof p === "string" ? p : p.uri))
        .join("/");
    }
    get exists() {
      return fakes.fileExists;
    }
    delete(): void {
      fakes.deleteDestination();
    }
    static createDownloadTask(
      ...args: Parameters<CreateDownloadTask>
    ): FakeDownloadTask {
      return fakes.createDownloadTask(...args);
    }
  }
  return { File: FakeFile, Paths: { cache: { uri: "cache" } } };
}

export function intentLauncherModule() {
  return {
    startActivityAsync: (...args: unknown[]) =>
      fakes.startActivityAsync(...args),
  };
}
