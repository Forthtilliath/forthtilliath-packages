import { describe, expect, it, vi } from "vitest";

import { createRenderApp, type RenderAppDeps } from "./createRenderApp.js";

function fakeDeps() {
  const events: string[] = [];
  let pathname = "";
  let resolveRender: (() => void) | undefined;
  const deps = {
    renderRouter: vi.fn((_appDir: string, options: { initialUrl: string }) => {
      events.push(`render ${options.initialUrl}`);
      pathname = options.initialUrl;
      // Like Testing Library v14: the render only ends once timers advance.
      return new Promise<{
        getPathname: () => string;
        getSearchParams: () => Record<string, string>;
      }>((resolve) => {
        resolveRender = () => {
          resolve({
            getPathname: () => pathname,
            getSearchParams: () => ({ id: "1" }),
          });
        };
      });
    }),
    act: vi.fn(async (callback: () => Promise<void>) => {
      events.push("act");
      await callback();
    }),
    navigate: vi.fn((path: string) => {
      events.push(`navigate ${path}`);
      pathname = path;
    }),
    advanceTimersByTimeAsync: vi.fn((ms: number) => {
      events.push(`advance ${String(ms)}`);
      resolveRender?.();
      return Promise.resolve();
    }),
  } satisfies RenderAppDeps<Record<string, string>>;
  return { deps, events };
}

describe("createRenderApp", () => {
  it("advances fake timers before awaiting the first render", async () => {
    const { deps, events } = fakeDeps();
    const app = await createRenderApp(deps)("/games");

    expect(deps.renderRouter).toHaveBeenCalledWith("./app", {
      initialUrl: "/games",
    });
    expect(events).toEqual(["render /games", "advance 100"]);
    expect(app.getPathname()).toBe("/games");
    expect(app.getSearchParams()).toEqual({ id: "1" });
  });

  it("returns a plain object, not a thenable", async () => {
    const { deps } = fakeDeps();
    const app = await createRenderApp(deps)("/");
    expect("then" in app).toBe(false);
  });

  it("navigates inside act", async () => {
    const { deps, events } = fakeDeps();
    const app = await createRenderApp(deps)("/");
    await app.navigate("/settings");

    expect(events.slice(-2)).toEqual(["act", "navigate /settings"]);
    expect(app.getPathname()).toBe("/settings");
  });

  it("takes a custom routes folder and settle time", async () => {
    const { deps } = fakeDeps();
    await createRenderApp(deps, { appDir: "./src/app", settleMs: 500 })("/");

    expect(deps.renderRouter).toHaveBeenCalledWith("./src/app", {
      initialUrl: "/",
    });
    expect(deps.advanceTimersByTimeAsync).toHaveBeenCalledWith(500);
  });
});
