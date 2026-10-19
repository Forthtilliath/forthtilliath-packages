import type { Preview } from "@storybook/react-vite";
import { expect, TestRunner } from "vitest";
import { page } from "vitest/browser";

// Visual run only (loaded by vitest.visual.setup.ts, never by Storybook).

/** Story parameter `visual`, e.g. `parameters: { visual: { delay: 5000 } }`. */
interface VisualParameters {
  /** Skips the story (endless JS animation, random content…). */
  disable?: boolean;
  /** Milliseconds to wait before the screenshots (long JS animation). */
  delay?: number;
}

// The theme's fonts aren't installed on Windows (`Menlo, monospace`,
// `Open Sans, sans-serif`): headless Chromium then resolves the generic
// family to Consolas on one launch, Courier New on another. Pinned to the
// installed fonts the generic families normally give, for this run only.
const fonts = document.createElement("style");
fonts.textContent = `@font-face { font-family: "Menlo"; src: local("Consolas"), local("Courier New"); }
@font-face { font-family: "Open Sans"; src: local("Arial"), local("Helvetica"); }`;
document.head.append(fonts);

// CSS animations, transitions and the text caret would make two renders of
// the same story differ: frozen during the screenshots only (play functions
// may wait for an exit animation, e.g. a dialog's `data-state="closed"`).
const freeze = document.createElement("style");
freeze.textContent = `*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}`;

const nextFrame = () =>
  new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });

/**
 * Loads every declared font face. `document.fonts.ready` only waits for the
 * ones already requested: Geist Mono (Google Fonts, `display=swap`) could
 * still be on its fallback when a code story is screenshotted.
 */
async function fontsLoaded() {
  await Promise.all(
    Array.from(document.fonts, (font) => font.load().catch(() => undefined)),
  );
  await document.fonts.ready;
}

/** Waits (up to 5 s) for the story's images to be loaded and decoded. */
async function imagesLoaded() {
  await Promise.race([
    Promise.all(
      Array.from(document.images, (img) => img.decode().catch(() => undefined)),
    ),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);
}

/**
 * Jumps every finite CSS / Web Animation to its end — an entrance, or a
 * dialog's exit after the play function closed it (found paused there, so
 * the closed dialog would otherwise stay on screen until `freeze` cancels
 * it, at an unpredictable moment). Their `animationend` lets Radix unmount
 * the closed parts; two frames let React commit that. Endless animations
 * are left to `freeze`.
 */
async function settleAnimations() {
  for (const animation of document.getAnimations()) {
    if (animation.effect?.getComputedTiming().endTime === Infinity) continue;
    try {
      animation.finish();
    } catch {
      // Not finishable (e.g. zero playback rate): `freeze` handles it.
    }
  }
  await nextFrame();
  await nextFrame();
}

const TRANSPARENT = "rgba(0, 0, 0, 0)";

/** Whether an element paints something of its own (text aside). */
function paintsBox(element: Element): boolean {
  if (element.childElementCount === 0) return true;
  const style = getComputedStyle(element);
  return (
    style.backgroundColor !== TRANSPARENT ||
    style.backgroundImage !== "none" ||
    style.boxShadow !== "none" ||
    ["Top", "Right", "Bottom", "Left"].some(
      (side) =>
        style.getPropertyValue(`border-${side.toLowerCase()}-width`) !== "0px",
    )
  );
}

/**
 * Area of the body screenshot actually covered by the story (text and boxes,
 * portals included), padded: the report crops the images to it. The
 * screenshot itself stays the whole body, aligned on the pixel grid — an
 * element screenshot at fractional coordinates shifts text by a subpixel
 * from one run to the next.
 */
function contentBox() {
  const origin = document.body.getBoundingClientRect();
  let [left, top, right, bottom] = [Infinity, Infinity, -Infinity, -Infinity];
  const add = (rect: DOMRect) => {
    if (!rect.width || !rect.height) return;
    left = Math.min(left, rect.left);
    top = Math.min(top, rect.top);
    right = Math.max(right, rect.right);
    bottom = Math.max(bottom, rect.bottom);
  };
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof Text) {
      if (!node.data.trim()) continue;
      range.selectNodeContents(node);
      add(range.getBoundingClientRect());
    } else if (node instanceof Element && paintsBox(node)) {
      add(node.getBoundingClientRect());
    }
  }
  if (left === Infinity) return undefined;
  const pad = 24;
  const x = Math.max(0, Math.floor(left - origin.left - pad));
  const y = Math.max(0, Math.floor(top - origin.top - pad));
  return {
    x,
    y,
    width: Math.min(origin.width, Math.ceil(right - origin.left + pad)) - x,
    height: Math.min(origin.height, Math.ceil(bottom - origin.top + pad)) - y,
  };
}

/**
 * Screenshots the whole body (portals included: open dialogs, popovers…)
 * once the story and its play function are done, in light then dark mode.
 * Soft assertions: a light change still lets the dark one be checked.
 */
export const afterEach: Preview["afterEach"] = async ({ id, parameters }) => {
  const visual = parameters.visual as VisualParameters | undefined;
  if (visual?.disable) return;

  if (visual?.delay) {
    await new Promise((resolve) => setTimeout(resolve, visual.delay));
  }
  await fontsLoaded();
  await imagesLoaded();
  await settleAnimations();
  // Read by scripts/visual/reporter.mjs (test meta is sent to the reporter).
  const test = TestRunner.getCurrentTest();
  if (test) Object.assign(test.meta, { visualBox: contentBox() });
  const subject = page.elementLocator(document.body);
  const root = document.documentElement;
  const wasDark = root.classList.contains("dark");

  document.head.append(freeze);
  await nextFrame();
  try {
    root.classList.remove("dark");
    await expect.soft(subject).toMatchScreenshot(id);
    root.classList.add("dark");
    await expect.soft(subject).toMatchScreenshot(`${id}--dark`);
  } finally {
    root.classList.toggle("dark", wasDark);
    freeze.remove();
  }
};
