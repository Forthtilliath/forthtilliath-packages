import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { UpdateBannerLocale } from "./UpdateAvailableBanner.js";
import type { ApkInstallState } from "./useApkInstall.js";

export interface UpdateInstallCardStyles {
  container?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  hint?: StyleProp<TextStyle>;
  error?: StyleProp<TextStyle>;
  actions?: StyleProp<ViewStyle>;
  retryButton?: StyleProp<ViewStyle>;
  retryButtonText?: StyleProp<TextStyle>;
  closeButton?: StyleProp<ViewStyle>;
  closeButtonText?: StyleProp<TextStyle>;
}

export interface UpdateInstallCardLabels {
  downloading?: (version: string, percent: number) => string;
  hint?: string;
  error?: (version: string) => string;
  retry?: string;
  close?: string;
}

export interface UpdateInstallCardProps {
  state: ApkInstallState;
  onRetry: () => void;
  onClose: () => void;
  labels?: UpdateInstallCardLabels;
  /** @defaultValue "fr" */
  locale?: UpdateBannerLocale;
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

// Progress of an update started from the UI (see `useApkInstall`): a
// non-interactive card while the APK downloads, then — only on failure — an
// error with Retry/Close. Renders nothing while idle.
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
