import { File, Paths } from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

export interface DownloadAndInstallApkOptions {
  apkUrl: string;
  /** Temp filename in the cache directory, e.g. "myapp-update.apk". */
  fileName: string;
  onProgress?: (fraction: number) => void;
}

/**
 * Downloads an APK to the cache directory and triggers the Android
 * install-package intent. Android only — there is no equivalent flow on iOS,
 * which doesn't allow installing a downloaded package outside the App Store.
 */
export async function downloadAndInstallApk({
  apkUrl,
  fileName,
  onProgress,
}: DownloadAndInstallApkOptions): Promise<void> {
  const destination = new File(Paths.cache, fileName);
  if (destination.exists) destination.delete();

  const task = File.createDownloadTask(apkUrl, destination, {
    onProgress: ({ bytesWritten, totalBytes }) => {
      if (totalBytes > 0) onProgress?.(bytesWritten / totalBytes);
    },
  });
  const file = await task.downloadAsync();
  if (!file) throw new Error("The download failed.");

  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: file.contentUri,
    flags: 1,
    type: "application/vnd.android.package-archive",
  });
}
