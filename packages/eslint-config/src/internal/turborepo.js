import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Whether `dir` or one of its parents holds a `turbo.json` — i.e. ESLint runs
 * inside a Turborepo, where eslint-plugin-turbo's rule makes sense. Used as
 * the default of the `turbo` option, so a standalone app doesn't have to pass
 * `turbo: false` (nor install the plugin) to load the config.
 *
 * @param {string} [dir] - Where to start looking; ESLint's working directory
 *   by default.
 * @returns {boolean}
 */
export function isInsideTurborepo(dir = process.cwd()) {
  for (let current = dir; ; current = dirname(current)) {
    if (existsSync(join(current, "turbo.json"))) return true;
    if (dirname(current) === current) return false;
  }
}
