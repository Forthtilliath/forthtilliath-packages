/** WCAG 2 AA minimum for body text. */
export const TEXT_CONTRAST = 4.5;

/** WCAG 2 AA minimum for large text and graphical objects (icons, bars). */
export const GRAPHIC_CONTRAST = 3;

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function channels(hex: string): [number, number, number] {
  const match = HEX.exec(hex.trim());
  if (!match?.[1]) throw new TypeError(`Invalid hex colour: "${hex}"`);
  const digits =
    match[1].length === 3 ? match[1].replace(/./g, "$&$&") : match[1];
  return [0, 2, 4].map((i) => Number.parseInt(digits.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

/**
 * The WCAG 2 relative luminance of a colour, from 0 (black) to 1 (white).
 *
 * @param hex - A `#rgb` or `#rrggbb` colour (`#` optional).
 * @returns Its relative luminance.
 * @throws {TypeError} If `hex` is not a 3- or 6-digit hex colour.
 * @example
 * relativeLuminance("#ffffff"); // => 1
 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The WCAG 2 contrast ratio between two colours, from 1 (identical) to 21
 * (black on white), whatever their order. Compare it with `TEXT_CONTRAST`
 * (4.5) or `GRAPHIC_CONTRAST` (3).
 *
 * @param a - A `#rgb` or `#rrggbb` colour.
 * @param b - Another one.
 * @returns The contrast ratio.
 * @throws {TypeError} If either colour is not a 3- or 6-digit hex colour.
 * @example
 * contrastRatio("#000", "#fff"); // => 21
 * contrastRatio("#767676", "#ffffff") >= TEXT_CONTRAST; // => true
 */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Black or white, whichever reads best on `background` (pure black or white
 * always reaches at least 4.58:1 on some side).
 *
 * @param background - A `#rgb` or `#rrggbb` colour.
 * @returns `"#ffffff"` or `"#000000"`.
 * @example
 * readableTextOn("#16283d"); // => "#ffffff"
 * readableTextOn("#84cc16"); // => "#000000"
 */
export function readableTextOn(background: string): "#ffffff" | "#000000" {
  return contrastRatio("#ffffff", background) >=
    contrastRatio("#000000", background)
    ? "#ffffff"
    : "#000000";
}
