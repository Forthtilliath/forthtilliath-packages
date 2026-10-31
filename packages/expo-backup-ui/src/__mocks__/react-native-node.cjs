// What @testing-library/react-native gets for its own `require("react-native")`
// (see vitest.setup.ts): Node loads that package itself, so Vite's alias to
// react-native.tsx never applies, and the real package's Flow syntax can't
// load. The library only reads `StyleSheet.flatten` from it.
"use strict";

function flatten(style) {
  if (Array.isArray(style)) {
    return style.reduce((acc, entry) => Object.assign(acc, flatten(entry)), {});
  }
  return style && typeof style === "object" ? style : undefined;
}

exports.StyleSheet = { flatten };
