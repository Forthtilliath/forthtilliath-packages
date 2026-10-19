import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Page } from "playwright";
import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Stand-in for every remote image (avatars, Unsplash photos…): the run must
// not depend on the network, nor on how fast an image loads.
const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#94a3b8"/><circle cx="200" cy="150" r="60" fill="#e2e8f0"/></svg>`;
const mockedPages = new WeakSet<Page>();

const mockRemoteImages: BrowserCommand = async (context) => {
  if (!("page" in context)) return;
  const { page } = context as unknown as { page: Page };
  if (mockedPages.has(page)) return;
  mockedPages.add(page);
  await page.route(
    (url) => !["localhost", "127.0.0.1"].includes(url.hostname),
    (route) =>
      route.request().resourceType() === "image"
        ? route.fulfill({ contentType: "image/svg+xml", body: PLACEHOLDER })
        : route.fallback(),
  );
};

// Visual regression run (`pnpm test:visual`), kept apart from `test` and CI:
// every story is screenshotted (light + dark) and compared with the local
// references of visual/baseline/. See "Visual regression" in the README.
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(dirname, ".storybook"),
    }),
  ],
  test: {
    name: "react-sb-visual",
    // A real render change shows up on every try; the rare one-off
    // difference (async highlighting, a late frame…) doesn't come back.
    retry: 1,
    // Copies of the failed screenshots Vitest attaches to the tests: kept in
    // the ignored visual/ folder, emptied on each run by the reporter.
    attachmentsDir: "visual/attachments",
    reporters: ["default", "./scripts/visual/reporter.mjs"],
    setupFiles: ["./.storybook/vitest.visual.setup.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        // Same flags as scripts/screenshot.mjs: no ClearType subpixel AA.
        launchOptions: {
          args: ["--disable-lcd-text", "--font-render-hinting=none"],
        },
        // JS animations that honour it (motion…) settle at once.
        contextOptions: { reducedMotion: "reduce" },
      }),
      instances: [{ browser: "chromium" }],
      commands: { mockRemoteImages },
      expect: {
        toMatchScreenshot: {
          resolveScreenshotPath: ({ arg, ext, root }) =>
            path.join(root, "visual/baseline", `${arg}${ext}`),
          resolveDiffPath: ({ arg, ext, root }) =>
            path.join(root, "visual/diff", `${arg}${ext}`),
        },
      },
    },
  },
});
