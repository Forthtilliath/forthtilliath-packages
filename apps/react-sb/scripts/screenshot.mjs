// Ad hoc visual QA helper: screenshots a single Storybook story via its
// iframe.html render, bypassing the outer Storybook UI chrome.
//
// Usage: node scripts/screenshot.mjs <storyId> <outFile> [WxH] [clickText]
// Requires a running Storybook dev server (default port 6007, see below).
//
// --disable-lcd-text/--font-render-hinting=none + deviceScaleFactor: 2 avoid
// a Windows ClearType subpixel-AA artifact that otherwise looks like RGB
// fringing on bold text in the screenshot (not a real rendering bug).
import { chromium } from "playwright";

const [, , storyId, outFile, viewport, clickText] = process.argv;
const [width, height] = (viewport ?? "800x600").split("x").map(Number);
const port = process.env.STORYBOOK_PORT ?? "6007";

if (!storyId || !outFile) {
  console.error(
    "Usage: node scripts/screenshot.mjs <storyId> <outFile> [WxH] [clickText]",
  );
  process.exit(1);
}

const browser = await chromium.launch({
  args: ["--disable-lcd-text", "--font-render-hinting=none"],
});
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
});
await page.goto(
  `http://localhost:${port}/iframe.html?id=${storyId}&viewMode=story`,
  { waitUntil: "networkidle" },
);
await page.waitForTimeout(400);
if (clickText) {
  await page.getByText(clickText, { exact: true }).first().click();
  await page.waitForTimeout(400);
}
await page.screenshot({ path: outFile, fullPage: true });
await browser.close();
console.log(`Saved ${outFile}`);
