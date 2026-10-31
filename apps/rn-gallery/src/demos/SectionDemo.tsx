import { Text, View } from "react-native";

import { Section } from "@forthtilliath/react-native-kit/components/layout/Section";
import { SectionTitle } from "@forthtilliath/react-native-kit/components/layout/SectionTitle";
import { SegmentedToggle } from "@forthtilliath/react-native-kit/components/picker/SegmentedToggle";

import { DemoFrame } from "../DemoFrame";
import { app, type Panel, themed } from "../palette";

const appTitle = {
  title: { color: app.muted },
  aside: { color: app.primary },
  rule: { backgroundColor: app.border },
};

const DURATIONS = [
  { value: "short", label: "Courte" },
  { value: "medium", label: "Moyenne" },
  { value: "long", label: "Longue" },
];

function Diamond({ panel }: { panel: Panel }) {
  return (
    <View
      style={{
        width: 7,
        height: 7,
        transform: [{ rotate: "45deg" }],
        backgroundColor: panel === "app" ? app.primary : "#9ca3af",
      }}
    />
  );
}

export function SectionDemo() {
  return (
    <DemoFrame>
      {(panel) => {
        const titleStyles = themed(panel, appTitle);
        const text = { color: panel === "app" ? app.text : "#111111" };
        return (
          <View style={{ gap: 20 }}>
            <SectionTitle title="Joueurs" styles={titleStyles} />
            <SectionTitle
              title="Joueurs"
              aside="4 sélectionnés"
              styles={titleStyles}
            />
            <SectionTitle
              title="Merveilles"
              rule
              leading={<Diamond panel={panel} />}
              styles={titleStyles}
            />
            <Section title="Durée" aside="Courte" titleStyles={titleStyles}>
              <SegmentedToggle
                options={DURATIONS}
                value="short"
                onChange={() => undefined}
                styles={themed(panel, {
                  button: {
                    backgroundColor: app.card,
                    borderColor: app.border,
                  },
                  buttonActive: {
                    backgroundColor: app.primary,
                    borderColor: app.primary,
                  },
                  text: { color: app.text },
                  textActive: { color: app.onPrimary },
                })}
              />
            </Section>
            <Section title="Notes" titleStyles={titleStyles} uppercase={false}>
              <Text style={text}>Titre sans petites capitales.</Text>
            </Section>
          </View>
        );
      }}
    </DemoFrame>
  );
}
