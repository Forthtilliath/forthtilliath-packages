import * as React from "react";

// @expo/vector-icons's own build uses extensionless internal imports (e.g.
// AntDesign.js importing "./createIconSet"), which Metro/webpack tolerate but
// Vite/Rollup's strict ESM resolver doesn't ("Cannot find module ...
// createIconSet"). Tests alias "@expo/vector-icons" to this minimal stub
// instead (see vitest.config.ts resolve.alias) — icon components only need
// to render as a plain host element with their props for tree assertions.
function createFakeIcon(name: string) {
  return function FakeIcon(props: Record<string, unknown>) {
    return React.createElement(name, props);
  };
}

export const Ionicons = createFakeIcon("Ionicons");
