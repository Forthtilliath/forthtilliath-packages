import { useEffect, useState } from "react";

import { compareVersions as defaultCompareVersions } from "@forthtilliath/expo-release-updates/compareVersions";
import type { LatestRelease } from "@forthtilliath/expo-release-updates/githubReleases";

/** A release as returned by `fetchLatestRelease` (same shape). */
export type UpdateCheckRelease = LatestRelease;

/**
 * State of {@link useUpdateCheck}: `idle` (not checked, throttled, up to date,
 * or dismissed), `available` with the newer `release`, or `error` when the
 * check failed (a failed check also counts for the throttle: the next one comes
 * after `minIntervalMs`).
 */
export type UpdateCheckState =
  | { status: "idle" }
  | { status: "available"; release: UpdateCheckRelease }
  | { status: "error" };

/** Options of {@link useUpdateCheck}, read once on mount. */
export interface UseUpdateCheckOptions {
  /**
   * The app's currently installed version, e.g. from its own version string.
   */
  currentVersion: string;
  /** Fetches the latest available release, or `null` if there is none. */
  checkForUpdate: () => Promise<UpdateCheckRelease | null>;
  /**
   * Positive when `a` is newer than `b`. Defaults to
   * `@forthtilliath/expo-release-updates`'s semver `compareVersions`.
   */
  compareVersions?: (a: string, b: string) => number;
  /**
   * Read once on mount: when the last check ran, and which version (if any) the
   * user already dismissed.
   */
  getLastCheck: () => {
    lastCheckedAt: number | null;
    dismissedVersion: string | null;
  };
  /**
   * Called after each completed check (success or failure) so the caller can
   * persist the timestamp.
   */
  onChecked: (lastCheckedAt: number) => void;
  /** Minimum delay between two checks. Defaults to 12h. */
  minIntervalMs?: number;
  /**
   * Clock used for the throttle. Defaults to `Date.now`; override it in tests.
   */
  now?: () => number;
}

const DEFAULT_MIN_INTERVAL_MS = 12 * 60 * 60 * 1000;

/**
 * Checks once per mount (e.g. app launch) whether a newer release is
 * available, throttled to at most one real network check per
 * `minIntervalMs`, and silent for a release the user already dismissed.
 * Where "when did we last check" and "which version was dismissed" are
 * stored is up to the caller (`getLastCheck` / `onChecked`, plus its own
 * dismiss handler). The options are read on mount only: pass stable values,
 * and mount the hook once what `getLastCheck` reads has loaded.
 *
 * @param options - The installed version, how to fetch the latest release, and
 *   the persistence callbacks.
 * @returns The check state (`idle`, `available` with the `release`, or
 *   `error`), plus `dismiss()` to hide an available update for this session.
 * @example
 * const update = useUpdateCheck({
 *   currentVersion: "1.4.0",
 *   checkForUpdate: () => fetchLatestRelease({ owner: "me", repo: "app", requireVerifiedApk: true }),
 *   getLastCheck: () => ({ lastCheckedAt: store.lastCheckAt, dismissedVersion: store.dismissed }),
 *   onChecked: (at) => store.setLastCheckAt(at),
 * });
 * if (update.status === "available") showBanner(update.release);
 */
export function useUpdateCheck({
  currentVersion,
  checkForUpdate,
  compareVersions = defaultCompareVersions,
  getLastCheck,
  onChecked,
  minIntervalMs = DEFAULT_MIN_INTERVAL_MS,
  now = Date.now,
}: UseUpdateCheckOptions): UpdateCheckState & { dismiss: () => void } {
  const [state, setState] = useState<UpdateCheckState>({ status: "idle" });

  useEffect(() => {
    const { lastCheckedAt, dismissedVersion } = getLastCheck();
    if (lastCheckedAt != null && now() - lastCheckedAt < minIntervalMs) return;

    let cancelled = false;

    checkForUpdate()
      .then((release) => {
        if (cancelled) return;
        onChecked(now());
        if (
          release &&
          compareVersions(release.version, currentVersion) > 0 &&
          release.version !== dismissedVersion
        ) {
          setState({ status: "available", release });
        } else {
          setState({ status: "idle" });
        }
      })
      .catch(() => {
        if (cancelled) return;
        onChecked(now());
        setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps -- runs once per mount by design (e.g. once per app launch); options are expected to be stable for the caller's lifetime.
  }, []);

  return {
    ...state,
    dismiss: () => {
      setState({ status: "idle" });
    },
  };
}
