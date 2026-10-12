import { useState } from "react";

/** Downloads an APK then hands it to Android's installer, reporting progress from 0 to 1. */
export type DownloadAndInstallApk = (
  apkUrl: string,
  onProgress?: (fraction: number) => void,
) => Promise<void>;

export type ApkInstallState =
  | { status: "idle" }
  | { status: "downloading"; version: string; progress: number }
  | { status: "error"; version: string; apkUrl: string };

// Tracks one APK download/install started from the UI: progress while it
// downloads, back to idle once Android's installer has taken over, an error
// state (keeping the URL) so the user can retry.
export function useApkInstall(downloadAndInstallApk: DownloadAndInstallApk) {
  const [state, setState] = useState<ApkInstallState>({ status: "idle" });

  function start(version: string, apkUrl: string) {
    setState({ status: "downloading", version, progress: 0 });
    downloadAndInstallApk(apkUrl, (progress) => {
      setState({ status: "downloading", version, progress });
    })
      .then(() => {
        setState({ status: "idle" });
      })
      .catch(() => {
        setState({ status: "error", version, apkUrl });
      });
  }

  function retry() {
    if (state.status === "error") start(state.version, state.apkUrl);
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, start, retry, reset };
}
