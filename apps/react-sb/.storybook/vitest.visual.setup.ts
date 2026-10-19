import { setProjectAnnotations } from "@storybook/react-vite";
import { beforeAll, vi } from "vitest";
import { commands } from "vitest/browser";

import * as previewAnnotations from "./preview";
import * as visualAnnotations from "./visual";

declare module "vitest/browser" {
  interface BrowserCommands {
    /** Serves a fixed placeholder for remote images (vitest.visual.config.ts). */
    mockRemoteImages: () => Promise<void>;
  }
}

// Setup of the visual run (vitest.visual.config.ts): the regular preview,
// plus a screenshot of every story. No axe here: `pnpm test` covers it.
const project = setProjectAnnotations([previewAnnotations, visualAnnotations]);

// A fixed clock, so dates shown by stories (RelativeTime, toast timestamps…)
// are the same on every run. Only `Date` is faked: timers run normally.
vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-01-15T10:30:00") });

beforeAll(async () => {
  await commands.mockRemoteImages();
});
beforeAll(project.beforeAll);
