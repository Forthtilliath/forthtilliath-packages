import { useState } from "react";

/**
 * Downloads an APK then hands it to Android's installer, reporting progress
 * from 0 to 1. `apkSha256` is the release's `apkSha256` (from
 * `fetchLatestRelease`), to pass on as `expectedSha256`.
 */
export type DownloadAndInstallApk = (
  apkUrl: string,
  onProgress?: (fraction: number) => void,
  apkSha256?: string,
) => Promise<void>;

export type ApkInstallState =
  | { status: "idle" }
  | { status: "downloading"; version: string; progress: number }
  | { status: "error"; version: string; apkUrl: string; apkSha256?: string };

// Tracks one APK download/install started from the UI: progress while it
// downloads, back to idle once Android's installer has taken over, an error
// state (keeping the URL) so the user can retry.
export function useApkInstall(downloadAndInstallApk: DownloadAndInstallApk) {
  const [state, setState] = useState<ApkInstallState>({ status: "idle" });

  function start(version: string, apkUrl: string, apkSha256?: string) {
    setState({ status: "downloading", version, progress: 0 });
    downloadAndInstallApk(
      apkUrl,
      (progress) => {
        setState({ status: "downloading", version, progress });
      },
      apkSha256,
    )
      .then(() => {
        setState({ status: "idle" });
      })
      .catch(() => {
        setState({ status: "error", version, apkUrl, apkSha256 });
      });
  }

  function retry() {
    if (state.status === "error") {
      start(state.version, state.apkUrl, state.apkSha256);
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, start, retry, reset };
}
