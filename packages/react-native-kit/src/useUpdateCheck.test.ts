/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import * as React from "react";
import { act, create } from "react-test-renderer";
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

function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Local async-aware renderHook: the shared ./__mocks__/renderHook.js helper
// only wraps a synchronous act(), which isn't enough here since the effect
// under test resolves a promise before calling setState (see PhotoPicker.test.tsx
// for the same flushAsync-inside-act pattern, needed for the same reason).
async function renderHookAsync<T>(callback: () => T) {
  const result: { current: T } = { current: undefined as unknown as T };
  function TestComponent() {
    result.current = callback();
    return null;
  }
  await act(async () => {
    create(React.createElement(TestComponent));
    await flushAsync();
  });
  return result;
}

describe("useUpdateCheck", () => {
  it("surfaces a newer, non-dismissed release", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const onChecked = vi.fn();
    const result = await renderHookAsync(() =>
      useUpdateCheck({
        currentVersion: "1.0.0",
        checkForUpdate,
        compareVersions,
        getLastCheck: () => ({ lastCheckedAt: null, dismissedVersion: null }),
        onChecked,
        now: () => 1000,
      }),
    );

    expect(checkForUpdate).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("available");
    expect(result.current).toMatchObject({
      status: "available",
      release: RELEASE,
    });
    expect(onChecked).toHaveBeenCalledWith(1000);
  });

  it("does not check again before minIntervalMs has elapsed", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const result = await renderHookAsync(() =>
      useUpdateCheck({
        currentVersion: "1.0.0",
        checkForUpdate,
        compareVersions,
        getLastCheck: () => ({ lastCheckedAt: 500, dismissedVersion: null }),
        onChecked: vi.fn(),
        minIntervalMs: 1000,
        now: () => 1000,
      }),
    );

    expect(checkForUpdate).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("stays idle when the fetched release is not newer than the current version", async () => {
    const checkForUpdate = vi
      .fn()
      .mockResolvedValue({ ...RELEASE, version: "1.0.0" });
    const result = await renderHookAsync(() =>
      useUpdateCheck({
        currentVersion: "1.0.0",
        checkForUpdate,
        compareVersions,
        getLastCheck: () => ({ lastCheckedAt: null, dismissedVersion: null }),
        onChecked: vi.fn(),
        now: () => 1000,
      }),
    );

    expect(result.current.status).toBe("idle");
  });

  it("stays idle when the newer release was already dismissed", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const result = await renderHookAsync(() =>
      useUpdateCheck({
        currentVersion: "1.0.0",
        checkForUpdate,
        compareVersions,
        getLastCheck: () => ({
          lastCheckedAt: null,
          dismissedVersion: RELEASE.version,
        }),
        onChecked: vi.fn(),
        now: () => 1000,
      }),
    );

    expect(result.current.status).toBe("idle");
  });

  it("reports an error when checkForUpdate rejects", async () => {
    const checkForUpdate = vi
      .fn()
      .mockRejectedValue(new Error("network error"));
    const onChecked = vi.fn();
    const result = await renderHookAsync(() =>
      useUpdateCheck({
        currentVersion: "1.0.0",
        checkForUpdate,
        compareVersions,
        getLastCheck: () => ({ lastCheckedAt: null, dismissedVersion: null }),
        onChecked,
        now: () => 1000,
      }),
    );

    expect(result.current.status).toBe("error");
    expect(onChecked).toHaveBeenCalledWith(1000);
  });

  it("dismiss() resets the status to idle", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const result = await renderHookAsync(() =>
      useUpdateCheck({
        currentVersion: "1.0.0",
        checkForUpdate,
        compareVersions,
        getLastCheck: () => ({ lastCheckedAt: null, dismissedVersion: null }),
        onChecked: vi.fn(),
        now: () => 1000,
      }),
    );
    expect(result.current.status).toBe("available");

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.status).toBe("idle");
  });
});
