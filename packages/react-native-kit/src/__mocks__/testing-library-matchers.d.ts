// @testing-library/react-native registers its matchers (toBeDisabled,
// toHaveStyle…) on the global expect, but only declares them for Jest.
import type { JestNativeMatchers } from "@testing-library/react-native/dist/matchers/types";

declare module "vitest" {
  interface Matchers<T> extends JestNativeMatchers<T> {
    /** Not a matcher: keeps T in use for the declaration merge. */
    readonly __testingLibraryReturn?: T;
  }
}
