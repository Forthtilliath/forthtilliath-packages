/**
 * Plugins that only some variants or options use are optional peer
 * dependencies (see package.json's `peerDependenciesMeta`): a React Native app
 * must not end up installing angular-eslint (and the whole Angular CLI it
 * pulls in), nor a plain TypeScript library every React plugin. Plugins a
 * variant always needs are imported statically by that variant's module;
 * plugins behind an option (`a11y`, `i18n`, `testingLibrary`, `turbo`) go
 * through these helpers instead, so a project that leaves the option off
 * doesn't have to install them.
 */

/**
 * Imports an optional plugin, resolving to `undefined` when the package isn't
 * installed. Any other failure (a broken install, a missing transitive
 * dependency of the plugin itself) is rethrown rather than hidden.
 *
 * @template T
 * @param {string} name - The package name, as passed to `import()`.
 * @param {() => Promise<{ default: T }>} load - `() => import(name)`, written
 *   out by the caller so the plugin keeps its type.
 * @returns {Promise<T | undefined>}
 */
export async function importOptional(name, load) {
  try {
    return (await load()).default;
  } catch (error) {
    if (isPackageNotFound(error, name)) return undefined;
    throw error;
  }
}

/**
 * @param {unknown} error
 * @param {string} name
 * @returns {boolean}
 */
function isPackageNotFound(error, name) {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === "ERR_MODULE_NOT_FOUND" &&
    // Node names the package it couldn't find: checking it tells "the
    // plugin isn't installed" apart from "the plugin is installed but one of
    // its own dependencies is missing", which must not be swallowed.
    error.message.includes(`'${name}'`)
  );
}

/**
 * Returns `plugin`, or throws an error explaining which package to install
 * (or which option to turn off) when it's missing.
 *
 * @template T
 * @param {T | undefined} plugin
 * @param {string} name - The package name.
 * @param {string} option - The option that needs it, e.g. `a11y`.
 * @returns {T}
 */
export function requirePlugin(plugin, name, option) {
  if (plugin === undefined) {
    throw new Error(
      `@forthtilliath/eslint-config: the \`${option}\` option needs ${name}, ` +
        `which isn't installed. Install it as a devDependency ` +
        `(npm install --save-dev ${name}), or pass \`${option}: false\`.`,
    );
  }
  return plugin;
}
