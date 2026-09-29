interface ParsedVersion {
  core: number[];
  prerelease: string[];
}

function parseVersion(version: string): ParsedVersion {
  // Drop a leading "v" (git tags) and build metadata ("+build.1"), which
  // semver ignores for precedence.
  const [withoutBuild = ""] = version.trim().replace(/^v/i, "").split("+");
  const dashIndex = withoutBuild.indexOf("-");
  const core =
    dashIndex === -1 ? withoutBuild : withoutBuild.slice(0, dashIndex);
  const prerelease = dashIndex === -1 ? "" : withoutBuild.slice(dashIndex + 1);
  return {
    core: core.split(".").map((part) => Number(part) || 0),
    prerelease: prerelease === "" ? [] : prerelease.split("."),
  };
}

function compareNumbers(a: number, b: number): number {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

// Semver rules: numeric identifiers compare numerically and rank below
// alphanumeric ones, which compare in ASCII order; with equal leading
// identifiers, the longer list ranks higher.
function comparePrerelease(a: string[], b: string[]): number {
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const idA = a[i];
    const idB = b[i];
    if (idA === undefined) return -1;
    if (idB === undefined) return 1;
    if (idA === idB) continue;
    const numA = /^\d+$/.test(idA) ? Number(idA) : null;
    const numB = /^\d+$/.test(idB) ? Number(idB) : null;
    if (numA !== null && numB !== null) return compareNumbers(numA, numB);
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return idA > idB ? 1 : -1;
  }
  return 0;
}

/**
 * Compares two version strings following semver precedence: "x.y.z"
 * segments first (missing ones count as `0`), then pre-release identifiers
 * (`1.0.0-beta.2` < `1.0.0-beta.10` < `1.0.0`). A leading `v` and build
 * metadata (`+build.1`) are ignored.
 *
 * @returns -1 if `a` < `b`, 0 if they're equal, 1 if `a` > `b`.
 * @example
 * compareVersions("1.10.0", "1.2.0"); // => 1
 * compareVersions("1.0.0-beta", "1.0.0"); // => -1
 * compareVersions("v2.0.0", "2.0.0"); // => 0
 */
export function compareVersions(a: string, b: string): number {
  const parsedA = parseVersion(a);
  const parsedB = parseVersion(b);

  const length = Math.max(parsedA.core.length, parsedB.core.length);
  for (let i = 0; i < length; i++) {
    const result = compareNumbers(parsedA.core[i] ?? 0, parsedB.core[i] ?? 0);
    if (result !== 0) return result;
  }

  // A version without pre-release identifiers ranks above one that has some.
  const isPrereleaseA = parsedA.prerelease.length > 0;
  const isPrereleaseB = parsedB.prerelease.length > 0;
  if (isPrereleaseA !== isPrereleaseB) return isPrereleaseA ? -1 : 1;
  return comparePrerelease(parsedA.prerelease, parsedB.prerelease);
}
