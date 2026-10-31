import { act, renderHook } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { useUpdateCheck } from "./useUpdateCheck.js";

const RELEASE = {
  version: "2.0.0",
  notes: "### Added\n- Something new.",
  apkUrl: "https://example.com/app.apk",
};

function compareVersions(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true });
}

type Options = Parameters<typeof useUpdateCheck>[0];

/** Renders the hook, then lets the check it starts on mount answer. */
async function renderCheck(options: Options) {
  const { result } = await renderHook(() => useUpdateCheck(options));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return result;
}

const neverChecked = () => ({ lastCheckedAt: null, dismissedVersion: null });

describe("useUpdateCheck", () => {
  it("surfaces a newer, non-dismissed release", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const onChecked = vi.fn();
    const result = await renderCheck({
      currentVersion: "1.0.0",
      checkForUpdate,
      compareVersions,
      getLastCheck: neverChecked,
      onChecked,
      now: () => 1000,
    });

    expect(checkForUpdate).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({
      status: "available",
      release: RELEASE,
    });
    expect(onChecked).toHaveBeenCalledWith(1000);
  });

  it("compares versions numerically by default when compareVersions is omitted", async () => {
    const result = await renderCheck({
      currentVersion: "1.9.0",
      checkForUpdate: () => Promise.resolve({ ...RELEASE, version: "1.10.0" }),
      getLastCheck: neverChecked,
      onChecked: vi.fn(),
    });

    // A plain string comparison would rank "1.10.0" below "1.9.0".
    expect(result.current.status).toBe("available");
  });

  it("does not check again before minIntervalMs has elapsed", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const result = await renderCheck({
      currentVersion: "1.0.0",
      checkForUpdate,
      compareVersions,
      getLastCheck: () => ({ lastCheckedAt: 500, dismissedVersion: null }),
      onChecked: vi.fn(),
      minIntervalMs: 1000,
      now: () => 1000,
    });

    expect(checkForUpdate).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("stays idle when the fetched release is not newer than the current version", async () => {
    const result = await renderCheck({
      currentVersion: "1.0.0",
      checkForUpdate: vi
        .fn()
        .mockResolvedValue({ ...RELEASE, version: "1.0.0" }),
      compareVersions,
      getLastCheck: neverChecked,
      onChecked: vi.fn(),
      now: () => 1000,
    });

    expect(result.current.status).toBe("idle");
  });

  it("stays idle when the newer release was already dismissed", async () => {
    const result = await renderCheck({
      currentVersion: "1.0.0",
      checkForUpdate: vi.fn().mockResolvedValue(RELEASE),
      compareVersions,
      getLastCheck: () => ({
        lastCheckedAt: null,
        dismissedVersion: RELEASE.version,
      }),
      onChecked: vi.fn(),
      now: () => 1000,
    });

    expect(result.current.status).toBe("idle");
  });

  it("reports an error when checkForUpdate rejects", async () => {
    const onChecked = vi.fn();
    const result = await renderCheck({
      currentVersion: "1.0.0",
      checkForUpdate: vi.fn().mockRejectedValue(new Error("network error")),
      compareVersions,
      getLastCheck: neverChecked,
      onChecked,
      now: () => 1000,
    });

    expect(result.current.status).toBe("error");
    expect(onChecked).toHaveBeenCalledWith(1000);
  });

  it("dismiss() resets the status to idle", async () => {
    const result = await renderCheck({
      currentVersion: "1.0.0",
      checkForUpdate: vi.fn().mockResolvedValue(RELEASE),
      compareVersions,
      getLastCheck: neverChecked,
      onChecked: vi.fn(),
      now: () => 1000,
    });
    expect(result.current.status).toBe("available");

    await act(() => {
      result.current.dismiss();
    });

    expect(result.current.status).toBe("idle");
  });
});
