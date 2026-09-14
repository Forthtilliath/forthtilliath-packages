/**
 * Compares two "x.y.z" version strings, segment by segment.
 *
 * @returns -1 if `a` < `b`, 0 if they're equal, 1 if `a` > `b`.
 */
export function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  const length = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < length; i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA !== numB) return numA > numB ? 1 : -1;
  }
  return 0;
}
