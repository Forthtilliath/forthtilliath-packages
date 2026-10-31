import { Alert } from "react-native";
import { act, renderHook } from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const shareViewAsImage = vi.hoisted(() =>
  vi.fn<(view: unknown, options: unknown) => Promise<void>>(),
);
vi.mock("../utils/helpers/shareViewAsImage.js", () => ({ shareViewAsImage }));

const { useViewShare } = await import("./useViewShare.js");

beforeEach(() => {
  shareViewAsImage.mockReset().mockResolvedValue(undefined);
  // Frames run as microtasks: deterministic, and all done within the act()
  // that starts the share, however slow the machine.
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => {
    queueMicrotask(callback);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useViewShare", () => {
  it("is capturing until the share is done, then shares the ref's view", async () => {
    let finish!: () => void;
    shareViewAsImage.mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    // Frames held until this test runs them.
    const frames: (() => void)[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: () => void) => {
      frames.push(callback);
      return 0;
    });
    const { result } = await renderHook(() =>
      useViewShare({ dialogTitle: "Partager le classement" }),
    );

    let sharing!: Promise<void>;
    await act(async () => {
      sharing = result.current.share();
      await Promise.resolve();
    });
    expect(result.current.capturing).toBe(true);
    expect(shareViewAsImage).not.toHaveBeenCalled();

    await act(async () => {
      // A frame may ask for the next one: run until none is left.
      for (let frame = frames.shift(); frame; frame = frames.shift()) frame();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(shareViewAsImage).toHaveBeenCalledWith(result.current.ref, {
      dialogTitle: "Partager le classement",
      locale: "fr",
    });

    await act(async () => {
      finish();
      await sharing;
    });
    expect(result.current.capturing).toBe(false);
  });

  it("ignores a second share while one is running", async () => {
    const { result } = await renderHook(() => useViewShare());
    await act(async () => {
      await Promise.all([result.current.share(), result.current.share()]);
    });
    expect(shareViewAsImage).toHaveBeenCalledTimes(1);
  });

  it("alerts the error's message by default", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    shareViewAsImage.mockRejectedValue(new Error("Pas de partage ici."));
    const { result } = await renderHook(() => useViewShare());
    await act(() => result.current.share());
    expect(alertSpy).toHaveBeenCalledWith(
      "Partage impossible",
      "Pas de partage ici.",
    );
    expect(result.current.capturing).toBe(false);
  });

  it("passes the error to onError instead", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const error = new Error("boom");
    shareViewAsImage.mockRejectedValue(error);
    const onError = vi.fn();
    const { result } = await renderHook(() => useViewShare({ onError }));
    await act(() => result.current.share());
    expect(onError).toHaveBeenCalledWith(error);
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
