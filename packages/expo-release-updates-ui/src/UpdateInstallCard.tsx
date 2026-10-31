import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { UpdateBannerLocale } from "./UpdateAvailableBanner.js";
import type { ApkInstallState } from "./useApkInstall.js";

/**
 * Style overrides of {@link UpdateInstallCard}, each merged over its default.
 */
export interface UpdateInstallCardStyles {
  /** The card around everything. */
  container?: StyleProp<ViewStyle>;
  /** The "Downloading version X… N%" line. */
  title?: StyleProp<TextStyle>;
  /** The line under it, explaining Android will ask for confirmation. */
  hint?: StyleProp<TextStyle>;
  /** The failure message. */
  error?: StyleProp<TextStyle>;
  /** The row holding Close and Retry. */
  actions?: StyleProp<ViewStyle>;
  /** The Retry button. */
  retryButton?: StyleProp<ViewStyle>;
  /** Its label. */
  retryButtonText?: StyleProp<TextStyle>;
  /** The Close button. */
  closeButton?: StyleProp<ViewStyle>;
  /** Its label. */
  closeButtonText?: StyleProp<TextStyle>;
}

/** Text overrides of {@link UpdateInstallCard}, whatever the `locale`. */
export interface UpdateInstallCardLabels {
  /**
   * Builds the progress line from the version and the rounded percentage.
   * Default: "Téléchargement de la version {version}… {percent}%".
   */
  downloading?: (version: string, percent: number) => string;
  /**
   * Shown under the progress. Default: "Le téléphone va ensuite demander
   * confirmation pour l'installer."
   */
  hint?: string;
  /**
   * Builds the failure message from the version. Default: "Le téléchargement de
   * la version {version} a échoué."
   */
  error?: (version: string) => string;
  /** Label of the Retry button. Default: "Réessayer" / "Retry". */
  retry?: string;
  /** Label of the Close button. Default: "Fermer" / "Close". */
  close?: string;
}

/** Props of {@link UpdateInstallCard}. */
export interface UpdateInstallCardProps {
  /** The install state, from {@link useApkInstall}. */
  state: ApkInstallState;
  /** Called by the Retry button (after a failure), e.g. `install.retry`. */
  onRetry: () => void;
  /** Called by the Close button (after a failure), e.g. `install.reset`. */
  onClose: () => void;
  /** Text overrides. */
  labels?: UpdateInstallCardLabels;
  /** @defaultValue "fr" */
  locale?: UpdateBannerLocale;
  /** Style overrides, merged over the defaults. */
  styles?: UpdateInstallCardStyles;
}

const defaultStyles: Required<UpdateInstallCardStyles> = {
  container: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    gap: 6,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  hint: { fontSize: 12, color: "#6b7280" },
  error: { fontSize: 14, color: "#dc2626" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  retryButtonText: { color: "#ffffff", fontWeight: "700" },
  closeButton: { paddingVertical: 8, paddingHorizontal: 14 },
  closeButtonText: { color: "#6b7280" },
};

const defaultLabels: Record<
  UpdateBannerLocale,
  Required<UpdateInstallCardLabels>
> = {
  fr: {
    downloading: (version, percent) =>
      `Téléchargement de la version ${version}… ${percent}%`,
    hint: "Le téléphone va ensuite demander confirmation pour l'installer.",
    error: (version) => `Le téléchargement de la version ${version} a échoué.`,
    retry: "Réessayer",
    close: "Fermer",
  },
  en: {
    downloading: (version, percent) =>
      `Downloading version ${version}… ${percent}%`,
    hint: "Your phone will then ask you to confirm the installation.",
    error: (version) => `Downloading version ${version} failed.`,
    retry: "Retry",
    close: "Close",
  },
};

/**
 * Shows the progress of an update started from the UI (see
 * {@link useApkInstall}): a non-interactive card with the percentage while the
 * APK downloads, then — only on failure — an error with Retry and Close
 * buttons. Renders nothing while idle (including once Android's installer
 * has taken over).
 *
 * @example
 * const install = useApkInstall(downloadAndInstall);
 * <UpdateInstallCard state={install.state} onRetry={install.retry} onClose={install.reset} />
 */
export function UpdateInstallCard({
  state,
  onRetry,
  onClose,
  labels,
  locale = "fr",
  styles,
}: UpdateInstallCardProps) {
  if (state.status === "idle") return null;
  const t = { ...defaultLabels[locale], ...labels };
  const s = (key: keyof UpdateInstallCardStyles) => [
    defaultStyles[key],
    styles?.[key],
  ];

  if (state.status === "downloading") {
    return (
      <View style={s("container")} pointerEvents="none">
        <Text style={s("title")}>
          {t.downloading(state.version, Math.round(state.progress * 100))}
        </Text>
        <Text style={s("hint")}>{t.hint}</Text>
      </View>
    );
  }

  return (
    <View style={s("container")}>
      <Text style={s("error")}>{t.error(state.version)}</Text>
      <View style={s("actions")}>
        <Pressable
          style={s("closeButton")}
          onPress={onClose}
          accessibilityRole="button"
        >
          <Text style={s("closeButtonText")}>{t.close}</Text>
        </Pressable>
        <Pressable
          style={s("retryButton")}
          onPress={onRetry}
          accessibilityRole="button"
        >
          <Text style={s("retryButtonText")}>{t.retry}</Text>
        </Pressable>
      </View>
    </View>
  );
}
