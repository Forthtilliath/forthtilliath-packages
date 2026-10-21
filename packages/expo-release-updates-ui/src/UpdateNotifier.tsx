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

export interface UpdateNotifierProps extends UseUpdateCheckOptions {
  /**
   * `false` until what `getLastCheck` reads has loaded (settings from an async
   * database...): the check runs once, on mount, so starting it earlier would
   * ignore both the throttle and the dismissed version. Default: `true`.
   */
  enabled?: boolean;
  downloadAndInstallApk: DownloadAndInstallApk;
  /** "Ignore": persist it so this exact version is never announced again. */
  onDismissVersion: (version: string) => void;
  /** @defaultValue "fr" */
  locale?: UpdateBannerLocale;
  labels?: {
    banner?: UpdateAvailableBannerLabels;
    install?: UpdateInstallCardLabels;
  };
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

// Whole update flow for a sideloaded app, to mount once near the root: checks
// for a new release on launch (`useUpdateCheck`), announces it, and
// "Install" downloads the APK right away with a progress card (Android then
// asks for confirmation) — no detour through an update screen. "Ignore" never
// announces that version again, but a newer one will be. Position it
// (absolute, safe area...) from the parent.
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
