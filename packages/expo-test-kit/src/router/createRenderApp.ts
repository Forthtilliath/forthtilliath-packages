// Ce que `renderRouter` (expo-router/testing-library) renvoie une fois résolu,
// réduit à ce dont renderApp a besoin.
interface RenderedRouter<SearchParams> {
  getPathname: () => string;
  getSearchParams: () => SearchParams;
}

export interface RenderAppDeps<SearchParams> {
  /** `renderRouter` from `expo-router/testing-library`. */
  renderRouter: (
    appDir: string,
    options: { initialUrl: string },
  ) => PromiseLike<RenderedRouter<SearchParams>>;
  /** `act` from `expo-router/testing-library`. */
  act: (callback: () => Promise<void>) => PromiseLike<unknown>;
  /** Navigates like the app does: `(path) => { router.navigate(path); }`. */
  navigate: (path: string) => unknown;
  /** `jest.advanceTimersByTimeAsync` or `vi.advanceTimersByTimeAsync`. */
  advanceTimersByTimeAsync: (ms: number) => PromiseLike<unknown>;
}

export interface RenderAppOptions {
  /** The routes folder, relative to the test runner's root. @defaultValue "./app" */
  appDir?: string;
  /** Fake time advanced for the first render to settle. @defaultValue 100 */
  settleMs?: number;
}

/**
 * Builds a `renderApp(initialUrl)` that renders the whole app — the real
 * screens of `app/`, the real Expo Router navigation — from a URL.
 *
 * Settles the two traps of `renderRouter` under Testing Library v14:
 * it turns fake timers on, so they must be advanced *before* awaiting the
 * render, or the first async render never ends; and what it returns is an
 * enriched promise, so `renderApp` hands back a plain object instead.
 * `navigate` waits for the render (`testRouter` checks the path right
 * after navigating, without waiting).
 *
 * Expo Router, its testing library and the test runner are passed in, so
 * this package depends on none of them.
 *
 * @example
 * ```ts
 * // test/renderApp.ts
 * import { router } from "expo-router";
 * import { act, renderRouter } from "expo-router/testing-library";
 * import { createRenderApp } from "@forthtilliath/expo-test-kit/router/createRenderApp";
 *
 * export const renderApp = createRenderApp({
 *   renderRouter,
 *   act,
 *   navigate: (path) => { router.navigate(path); },
 *   advanceTimersByTimeAsync: (ms) => jest.advanceTimersByTimeAsync(ms),
 * });
 *
 * // in a test
 * const app = await renderApp("/games/new");
 * await app.navigate("/settings");
 * expect(app.getPathname()).toBe("/settings");
 * ```
 */
export function createRenderApp<SearchParams>(
  deps: RenderAppDeps<SearchParams>,
  { appDir = "./app", settleMs = 100 }: RenderAppOptions = {},
) {
  return async function renderApp(initialUrl: string) {
    const rendering = deps.renderRouter(appDir, { initialUrl });
    await deps.advanceTimersByTimeAsync(settleMs);
    const app = await rendering;
    return {
      getPathname: () => app.getPathname(),
      getSearchParams: () => app.getSearchParams(),
      navigate: async (path: string) => {
        // Un callback qui renvoie une promesse : act attend la fin du rendu.
        await deps.act(() => {
          deps.navigate(path);
          return Promise.resolve();
        });
      },
    };
  };
}
