import { registerHooks } from "node:module";

// @testing-library/react-native is CommonJS loaded by Node, so its
// `require("react-native")` skips Vite's alias and would reach the real
// package, which can't load here (Flow syntax). Hand it a small stub instead.
const reactNativeForNode = new URL(
  "./src/__mocks__/react-native-node.cjs",
  import.meta.url,
).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier === "react-native" &&
      context.parentURL?.includes("/@testing-library/react-native/")
    ) {
      return { url: reactNativeForNode, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
