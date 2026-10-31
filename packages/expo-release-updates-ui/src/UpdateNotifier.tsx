import type {
  UpdateAvailableBannerLabels,
  UpdateAvailableBannerStyles,
  UpdateBannerLocale,
} from "./UpdateAvailableBanner.js";
import { UpdateAvailableBanner } from "./UpdateAvailableBanner.js";
import type {
  UpdateInstallCardLabels,
  UpdateInstallCardStyles,
} from "./UpdateInstallCard.js";
import { UpdateInstallCard } from "./UpdateInstallCard.js";
import type { DownloadAndInstallApk } from "./useApkInstall.js";
import { useApkInstall } from "./useApkInstall.js";
import type { UseUpdateCheckOptions } from "./useUpdateCheck.js";
import { useUpdateCheck } from "./useUpdateCheck.js";

/**
 * Props of {@link UpdateNotifier}: the {@link UseUpdateCheckOptions} of the
 * check, plus the install, the dismissal and the look.
 */
export interface UpdateNotifierProps extends UseUpdateCheckOptions {
  /**
   * `false` until what `getLastCheck` reads has loaded (settings from an async
   * database...): the check runs once, on mount, so starting it earlier would
   * ignore both the throttle and the dismissed version. Default: `true`.
   */
  enabled?: boolean;
  /**
   * Downloads and installs the announced APK (see {@link
   * DownloadAndInstallApk}); pass the release's SHA-256 on as `expectedSha256`.
   */
  downloadAndInstallApk: DownloadAndInstallApk;
  /** "Ignore": persist it so this exact version is never announced again. */
  onDismissVersion: (version: string) => void;
  /** @defaultValue "fr" */
  locale?: UpdateBannerLocale;
  /** Text overrides of the banner and of the install card. */
  labels?: {
    banner?: UpdateAvailableBannerLabels;
    install?: UpdateInstallCardLabels;
  };
  /** Style overrides of the banner and of the install card. */
  styles?: {
    banner?: UpdateAvailableBannerStyles;
    install?: UpdateInstallCardStyles;
  };
}

const bannerLabels: Record<UpdateBannerLocale, UpdateAvailableBannerLabels> = {
  fr: { action: "Installer", dismiss: "Ignorer" },
  en: { action: "Install", dismiss: "Ignore" },
};

const dismissAccessibilityLabel: Record<
  UpdateBannerLocale,
  (version: string) => string
> = {
  fr: (version) => `Ignorer la version ${version}`,
  en: (version) => `Ignore version ${version}`,
};

/**
 * Whole update flow for a sideloaded app, to mount once near the root: checks
 * for a new release on launch ({@link useUpdateCheck}), announces it with an
 * {@link UpdateAvailableBanner}, and "Install" downloads the APK right away
 * with an {@link UpdateInstallCard} showing progress (Android then asks for
 * confirmation) — no detour through an update screen. "Ignore" never
 * announces that version again, but a newer one will be. Renders nothing when
 * there is nothing to show; position it (absolute, safe area…) from the
 * parent.
 *
 * @example
 * <View style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16 }}>
 *   <UpdateNotifier
 *     enabled={settingsLoaded}
 *     currentVersion={Constants.expoConfig?.version ?? "0.0.0"}
 *     checkForUpdate={() => fetchLatestRelease({ ...REPO, requireVerifiedApk: true })}
 *     getLastCheck={() => ({ lastCheckedAt: settings.lastCheckAt, dismissedVersion: settings.dismissedVersion })}
 *     onChecked={(at) => saveSettings({ lastCheckAt: at })}
 *     onDismissVersion={(version) => saveSettings({ dismissedVersion: version })}
 *     downloadAndInstallApk={(url, onProgress, sha256) =>
 *       downloadAndInstallApk({ apkUrl: url, fileName: "app-update.apk", onProgress,
 *         expectedSha256: sha256, allowedUrlPrefix: releaseDownloadUrlPrefix(REPO) })}
 *   />
 * </View>
 */
export function UpdateNotifier({
  enabled = true,
  ...props
}: UpdateNotifierProps) {
  return enabled ? <ActiveUpdateNotifier {...props} /> : null;
}

function ActiveUpdateNotifier({
  downloadAndInstallApk,
  onDismissVersion,
  locale = "fr",
  labels,
  styles,
  ...checkOptions
}: Omit<UpdateNotifierProps, "enabled">) {
  const update = useUpdateCheck(checkOptions);
  const install = useApkInstall(downloadAndInstallApk);

  if (install.state.status !== "idle") {
    return (
      <UpdateInstallCard
        state={install.state}
        onRetry={install.retry}
        onClose={install.reset}
        locale={locale}
        labels={labels?.install}
        styles={styles?.install}
      />
    );
  }

  if (update.status !== "available") return null;
  const { release } = update;

  return (
    <UpdateAvailableBanner
      version={release.version}
      notes={release.notes}
      locale={locale}
      labels={{
        ...bannerLabels[locale],
        dismissAccessibilityLabel: dismissAccessibilityLabel[locale](
          release.version,
        ),
        ...labels?.banner,
      }}
      styles={styles?.banner}
      onPress={() => {
        // Not persisted as dismissed: if the install doesn't go through, the
        // banner may come back on a later launch (unlike "Ignore").
        update.dismiss();
        install.start(release.version, release.apkUrl, release.apkSha256);
      }}
      onDismiss={() => {
        onDismissVersion(release.version);
        update.dismiss();
      }}
    />
  );
}
