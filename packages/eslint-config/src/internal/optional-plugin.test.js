import { describe, expect, it } from "vitest";

import { importOptional, requirePlugin } from "./optional-plugin.js";

/**
 * @param {string} message
 * @returns {Error}
 */
function moduleNotFound(message) {
  return Object.assign(new Error(message), { code: "ERR_MODULE_NOT_FOUND" });
}

describe("importOptional", () => {
  it("returns the module's default export", async () => {
    const plugin = { rules: {} };
    expect(
      await importOptional("some-plugin", () =>
        Promise.resolve({ default: plugin }),
      ),
    ).toBe(plugin);
  });

  it("returns undefined when the package isn't installed", async () => {
    const name = "eslint-plugin-forthtilliath-not-installed";
    expect(await importOptional(name, () => import(name))).toBeUndefined();
  });

  it("rethrows when a dependency of the plugin itself is missing", async () => {
    const error = moduleNotFound(
      "Cannot find package 'aria-query' imported from /eslint-plugin-jsx-a11y/lib/index.js",
    );
    await expect(
      importOptional("eslint-plugin-jsx-a11y", () => Promise.reject(error)),
    ).rejects.toBe(error);
  });

  it("rethrows any other loading error", async () => {
    const error = new SyntaxError("Unexpected token");
    await expect(
      importOptional("some-plugin", () => Promise.reject(error)),
    ).rejects.toBe(error);
  });
});

describe("requirePlugin", () => {
  it("returns the plugin when it's installed", () => {
    const plugin = { rules: {} };
    expect(requirePlugin(plugin, "some-plugin", "someOption")).toBe(plugin);
  });

  it("names the package to install and the option to turn off", () => {
    expect(() =>
      requirePlugin(undefined, "eslint-plugin-jsx-a11y", "a11y"),
    ).toThrow(/eslint-plugin-jsx-a11y.*`a11y: false`/s);
  });
});
