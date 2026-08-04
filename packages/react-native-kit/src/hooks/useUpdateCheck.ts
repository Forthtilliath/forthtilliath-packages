import { useEffect, useState } from "react";

export interface UpdateCheckRelease {
  version: string;
  notes: string;
  apkUrl: string;
}

export type UpdateCheckState =
  | { status: "idle" }
  | { status: "available"; release: UpdateCheckRelease }
  | { status: "error" };

export interface UseUpdateCheckOptions {
  /** The app's currently installed version, e.g. from its own version string. */
  currentVersion: string;
  /** Fetches the latest available release, or `null` if there is none. */
  checkForUpdate: () => Promise<UpdateCheckRelease | null>;
  /** Positive when `a` is newer than `b`, e.g. semver comparison. */
  compareVersions: (a: string, b: string) => number;
  /** Read once on mount: when the last check ran, and which version (if any) the user already dismissed. */
  getLastCheck: () => {
    lastCheckedAt: number | null;
    dismissedVersion: string | null;
  };
  /** Called after each completed check (success or failure) so the caller can persist the timestamp. */
  onChecked: (lastCheckedAt: number) => void;
  /** Minimum delay between two checks. Defaults to 12h. */
  minIntervalMs?: number;
  now?: () => number;
}

const DEFAULT_MIN_INTERVAL_MS = 12 * 60 * 60 * 1000;

// Checks once per mount (e.g. app launch) whether a newer release is
// available, throttled to at most one real network check per `minIntervalMs`
// and silent for a release the user already dismissed. Persistence of
// "when did we last check" / "which version did the user dismiss" is left
// entirely to the caller (`getLastCheck`/`onChecked`, plus its own dismiss
// handler) — this hook has no opinion on where that lives.
export function useUpdateCheck({
  currentVersion,
  checkForUpdate,
  compareVersions,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps, @eslint-react/exhaustive-deps -- runs once per mount by design (e.g. once per app launch); options are expected to be stable for the caller's lifetime.
  }, []);

  return {
    ...state,
    dismiss: () => {
      setState({ status: "idle" });
    },
  };
}
