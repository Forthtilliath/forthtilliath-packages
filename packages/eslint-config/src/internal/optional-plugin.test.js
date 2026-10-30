import { describe, expect, it } from "vitest";

import { requireOptional } from "./optional-plugin.js";

/**
 * @param {string} message
 * @param {string} [code]
 * @returns {Error}
 */
function moduleNotFound(message, code = "MODULE_NOT_FOUND") {
  return Object.assign(new Error(message), { code });
}

/**
 * @param {unknown} error
 * @returns {(name: string) => never}
 */
function failingWith(error) {
  return () => {
    throw error;
  };
}

describe("requireOptional", () => {
  it("returns a CommonJS plugin's module.exports", () => {
    const plugin = { rules: {} };
    expect(requireOptional("some-plugin", "someOption", () => plugin)).toBe(
      plugin,
    );
  });

  it("returns an ES module plugin's default export", () => {
    const plugin = { rules: {} };
    const esm = Object.defineProperty({ default: plugin }, Symbol.toStringTag, {
      value: "Module",
    });
    expect(requireOptional("some-plugin", "someOption", () => esm)).toBe(
      plugin,
    );
  });

  it("names the package to install and the option to turn off", () => {
    const name = "eslint-plugin-forthtilliath-not-installed";
    expect(() => requireOptional(name, "a11y")).toThrow(
      new RegExp(`${name}.*\`a11y: false\``, "s"),
    );
  });

  it("recognizes the ES module flavour of a missing package", () => {
    const error = moduleNotFound(
      "Cannot find package 'eslint-plugin-jsx-a11y' imported from /x.js",
      "ERR_MODULE_NOT_FOUND",
    );
    expect(() =>
      requireOptional("eslint-plugin-jsx-a11y", "a11y", failingWith(error)),
    ).toThrow(/`a11y: false`/);
  });

  it("rethrows when a dependency of the plugin itself is missing", () => {
    const error = moduleNotFound(
      "Cannot find module 'aria-query'\nRequire stack:\n- /node_modules/eslint-plugin-jsx-a11y/lib/index.js",
    );
    expect(() =>
      requireOptional("eslint-plugin-jsx-a11y", "a11y", failingWith(error)),
    ).toThrow(error);
  });

  it("rethrows any other loading error", () => {
    const error = new SyntaxError("Unexpected token");
    expect(() =>
      requireOptional("some-plugin", "someOption", failingWith(error)),
    ).toThrow(error);
  });
});
