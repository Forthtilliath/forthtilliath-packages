import { Alert } from "react-native";

// Subpath: errors.js loads no native module, unlike the package root.
import {
  BackupError,
  type BackupErrorCode,
  backupErrorDetail,
} from "@forthtilliath/expo-backup/errors";

import type { BackupScreenLabels } from "./labels.js";

/**
 * Message of an error code, followed by its technical cause when known. The
 * code may come from a state saved by another version: unknown ones fall
 * back to the generic message rather than to nothing.
 */
export function codeMessage(
  t: BackupScreenLabels,
  code: BackupErrorCode,
  detail: string | null = null,
): string {
  const message = (t.errors[code] as string | undefined) ?? t.errors.unknown;
  return detail ? `${message}\n\n${t.errorDetail(detail)}` : message;
}

/** User-facing text of any error: localized for the package's own, as is for the app's. */
export function errorMessage(error: unknown, t: BackupScreenLabels): string {
  // The app's own errors (`parse`…) are already meant for the user: no detail.
  if (error instanceof BackupError)
    return codeMessage(t, error.code, backupErrorDetail(error));
  if (error instanceof Error && error.message) return error.message;
  return t.errors.unknown;
}

export function showError(error: unknown, t: BackupScreenLabels): void {
  Alert.alert(t.errorTitle, errorMessage(error, t));
}

/** Resolves to true only if the user taps `confirmLabel` (not on cancel or dismiss). */
export function askConfirmation(
  t: BackupScreenLabels,
  title: string,
  message: string,
  confirmLabel: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: t.cancel,
          style: "cancel",
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: confirmLabel,
          style: "destructive",
          onPress: () => {
            resolve(true);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          resolve(false);
        },
      },
    );
  });
}

/** Which backup to keep when linking an account that already holds one; null if cancelled. */
export function askConflictChoice(
  t: BackupScreenLabels,
  description: string,
): Promise<"device" | "cloud" | null> {
  return new Promise((resolve) => {
    Alert.alert(
      t.conflictTitle,
      t.conflictMessage(description),
      [
        {
          text: t.cancel,
          style: "cancel",
          onPress: () => {
            resolve(null);
          },
        },
        {
          text: t.conflictKeepDevice,
          style: "destructive",
          onPress: () => {
            resolve("device");
          },
        },
        {
          text: t.conflictKeepCloud,
          onPress: () => {
            resolve("cloud");
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          resolve(null);
        },
      },
    );
  });
}
