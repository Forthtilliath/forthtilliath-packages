import { StyleSheet, View } from "react-native";

import { BottomSheetHeader } from "@forthtilliath/react-native-kit/components/overlay/BottomSheetHeader";
import { CheckboxGroup } from "@forthtilliath/react-native-kit/components/picker/CheckboxGroup";

import { DemoFrame } from "../DemoFrame";
import { app, type Panel, themed } from "../palette";

const TAGS = [
  { value: "coop", label: "Coopératif" },
  { value: "party", label: "Ambiance" },
  { value: "deck", label: "Deck-building" },
  { value: "solo", label: "Solo" },
];

// react-native-web draws a Modal over the whole page: the sheet is drawn
// in place instead, with BottomSheet's own default sheet style and the very
// header component BottomSheet renders.
function Sheet({ panel }: { panel: Panel }) {
  return (
    <View
      style={[styles.sheet, panel === "app" && { backgroundColor: app.card }]}
    >
      <BottomSheetHeader
        title="Filtres"
        subtitle="12 jeux correspondent"
        action={{ label: "Réinitialiser", onPress: () => undefined }}
        onClose={() => undefined}
        styles={themed(panel, {
          handle: { backgroundColor: app.border },
          title: { color: app.text },
          subtitle: { color: app.muted },
          action: { color: app.primary },
          close: { backgroundColor: app.primarySoft },
          closeIcon: { color: app.text },
        })}
      />
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <CheckboxGroup
          options={TAGS}
          values={["coop", "solo"]}
          onChange={() => undefined}
          styles={themed(panel, {
            chip: { backgroundColor: app.background, borderColor: app.border },
            chipChecked: {
              backgroundColor: app.primary,
              borderColor: app.primary,
            },
            text: { color: app.text },
            textChecked: { color: app.onPrimary },
          })}
        />
      </View>
    </View>
  );
}

export function BottomSheetDemo() {
  return (
    <DemoFrame height={360}>
      {(panel) => (
        <View style={styles.backdrop}>
          <Sheet panel={panel} />
        </View>
      )}
    </DemoFrame>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
