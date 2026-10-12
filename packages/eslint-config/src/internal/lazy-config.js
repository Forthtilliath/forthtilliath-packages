/**
 * Wraps a config factory call so it only runs the first time the resulting
 * array is actually read (spread, iterated, indexed...).
 *
 * Every variant module exports a ready-made default (`reactConfig`,
 * `nextJsConfig`...) next to its factory. Built eagerly, that default would
 * load every optional plugin its default options enable (`a11y`, `turbo`) as
 * soon as the module is imported — so a project calling
 * `createReactNativeConfig({ turbo: false })` would still crash on a missing
 * eslint-plugin-turbo, just because `reactConfig` was evaluated on the way.
 *
 * @param {() => import("eslint").Linter.Config[]} create
 * @returns {import("eslint").Linter.Config[]}
 */
export function lazyConfig(create) {
  /** @type {import("eslint").Linter.Config[] | undefined} */
  let config;
  const resolve = () => (config ??= create());
  // The target is a real (empty) array so `Array.isArray()` stays true —
  // ESLint's `defineConfig()` relies on it to flatten nested configs.
  return new Proxy(/** @type {import("eslint").Linter.Config[]} */ ([]), {
    get: (_target, key) => Reflect.get(resolve(), key),
    has: (_target, key) => Reflect.has(resolve(), key),
    ownKeys: () => Reflect.ownKeys(resolve()),
    getOwnPropertyDescriptor: (_target, key) =>
      Reflect.getOwnPropertyDescriptor(resolve(), key),
  });
}
