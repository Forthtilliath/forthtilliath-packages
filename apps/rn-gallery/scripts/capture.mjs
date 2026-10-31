// Screenshots every demo of src/demos into react-native-kit's docs, for its
// README: starts Vite, opens each `?demo=<id>` page in Chromium, captures
// the #demo frame.
//
// Usage: pnpm --filter rn-gallery screenshots [id…]
// (build react-native-kit first: the gallery imports its dist/).
//
// --disable-lcd-text/--font-render-hinting=none + deviceScaleFactor: 2 avoid
// Windows ClearType colour fringing on text (same as react-sb's screenshot.mjs).
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = fileURLToPath(
  new URL(
    "../../../packages/react-native-kit/docs/screenshots/",
    import.meta.url,
  ),
);
const ALL = [
  "button",
  "text-field",
  "section-title",
  "empty-state",
  "toast",
  "reorder-list",
  "bottom-sheet-header",
];
const ids = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ALL;

const server = await createServer({ root, logLevel: "warn" });
await server.listen();
const base = server.resolvedUrls?.local[0] ?? "http://localhost:5199/";

const browser = await chromium.launch({
  args: ["--disable-lcd-text", "--font-render-hinting=none"],
});
try {
  await mkdir(outDir, { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 800, height: 900 },
    deviceScaleFactor: 2,
  });
  // A demo that throws renders nothing: say why instead of timing out.
  page.on("pageerror", (error) => {
    console.error(`Page error: ${error.message}`);
  });
  for (const id of ids) {
    await page.goto(`${base}?demo=${id}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Fade-ins (toasts, Reveal) last a few hundred ms.
    await page.waitForTimeout(800);
    const frame = page.locator("#demo");
    await frame.screenshot({ path: `${outDir}${id}.png` });
    console.log(`Saved docs/screenshots/${id}.png`);
  }
} finally {
  await browser.close();
  await server.close();
}
