import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { app, type Panel } from "./palette";

interface Props {
  /** Renders the demo once per panel. */
  children: (panel: Panel) => ReactNode;
  /** Height of each panel, for demos drawing absolutely-positioned content. */
  height?: number;
}

const PANELS: { panel: Panel; caption: string }[] = [
  { panel: "default", caption: "Par défaut (aucune couleur passée)" },
  { panel: "app", caption: "Aux couleurs d'une app (colors / styles)" },
];

/** Two phone-width panels side by side: the neutral defaults, then a themed app. */
export function DemoFrame({ children, height }: Props) {
  return (
    <View style={styles.frame} nativeID="demo">
      {PANELS.map(({ panel, caption }) => (
        <View key={panel} style={styles.column}>
          <Text style={styles.caption}>{caption}</Text>
          <View
            style={[
              styles.panel,
              panel === "app" && styles.appPanel,
              height !== undefined && { height },
            ]}
          >
            {children(panel)}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 16,
    padding: 16,
    backgroundColor: "#e5e7eb",
  },
  column: { width: 360, gap: 8 },
  caption: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
  },
  panel: {
    flexGrow: 1,
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  appPanel: { backgroundColor: app.background },
});
