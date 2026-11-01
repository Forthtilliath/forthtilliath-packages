import { cleanup, render, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ServiceWorkerRegister } from "./service-worker-register.js";
import { useServiceWorker } from "./useServiceWorker.js";

function stubServiceWorker(register: (...args: unknown[]) => Promise<unknown>) {
  vi.stubGlobal("navigator", { serviceWorker: { register } });
}

describe("useServiceWorker", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("registers the worker with its options", () => {
    const register = vi.fn().mockResolvedValue({});
    stubServiceWorker(register);

    renderHook(() => {
      useServiceWorker("/sw.js", { scope: "/app/" });
    });

    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/app/" });
  });

  it("registers only once across re-renders with inline options", () => {
    const register = vi.fn().mockResolvedValue({});
    stubServiceWorker(register);

    const { rerender } = renderHook(() => {
      useServiceWorker("/sw.js", { onError: () => undefined });
    });
    rerender();

    expect(register).toHaveBeenCalledTimes(1);
  });

  it("does nothing when disabled", () => {
    const register = vi.fn().mockResolvedValue({});
    stubServiceWorker(register);

    renderHook(() => {
      useServiceWorker("/sw.js", { enabled: false });
    });

    expect(register).not.toHaveBeenCalled();
  });

  it("does nothing without service worker support", () => {
    vi.stubGlobal("navigator", {});

    expect(() =>
      renderHook(() => {
        useServiceWorker("/sw.js");
      }),
    ).not.toThrow();
  });

  it("reports a failed registration to onError", async () => {
    const error = new Error("blocked");
    stubServiceWorker(vi.fn().mockRejectedValue(error));
    const onError = vi.fn();

    renderHook(() => {
      useServiceWorker("/sw.js", { onError });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("ignores a failed registration without onError", async () => {
    const register = vi.fn().mockRejectedValue(new Error("blocked"));
    stubServiceWorker(register);

    renderHook(() => {
      useServiceWorker("/sw.js");
    });

    await waitFor(() => {
      expect(register).toHaveBeenCalled();
    });
  });
});

describe("ServiceWorkerRegister", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("registers the worker and renders nothing", () => {
    const register = vi.fn().mockResolvedValue({});
    stubServiceWorker(register);

    const { container } = render(<ServiceWorkerRegister src="/sw.js" />);

    expect(register).toHaveBeenCalledWith("/sw.js", {});
    expect(container.innerHTML).toBe("");
  });
});
