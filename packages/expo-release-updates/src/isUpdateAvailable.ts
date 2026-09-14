import { compareVersions } from "./compareVersions.js";

/**
 * Whether `latestVersion` is strictly newer than `currentVersion`.
 *
 * Thin, named wrapper around `compareVersions` for the common "should I show
 * the update prompt?" check, so call sites read as intent rather than a bare
 * `compareVersions(a, b) > 0` comparison repeated at every call site.
 *
 * @example
 * isUpdateAvailable("1.2.0", "1.10.0"); // true
 * isUpdateAvailable("1.2.0", "1.2.0"); // false
 */
export function isUpdateAvailable(
  currentVersion: string,
  latestVersion: string,
): boolean {
  return compareVersions(latestVersion, currentVersion) > 0;
}
