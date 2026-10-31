import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@forthtilliath/react-native-kit/components/form/Button";

import { DemoFrame } from "../DemoFrame";
import { app, themed } from "../palette";

const appColors = {
  primary: app.primary,
  onPrimary: app.onPrimary,
  secondary: app.card,
  onSecondary: app.text,
  border: app.border,
  danger: app.danger,
  onDanger: app.onDanger,
};

export function ButtonDemo() {
  return (
    <DemoFrame>
      {(panel) => {
        const colors = themed(panel, appColors);
        return (
          <>
            <Button
              label="Lancer la partie"
              colors={colors}
              icon={(color) => <Ionicons name="play" size={18} color={color} />}
            />
            <Button label="Secondaire" variant="secondary" colors={colors} />
            <Button label="Contour" variant="outline" colors={colors} />
            <Button label="Discret (ghost)" variant="ghost" colors={colors} />
            <Button label="Supprimer" variant="danger" colors={colors} />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button label="Petit" size="sm" colors={colors} />
              <Button label="Envoi…" size="sm" loading colors={colors} />
              <Button label="Désactivé" size="sm" disabled colors={colors} />
            </View>
            <Button
              label="Suivant"
              size="lg"
              iconPosition="end"
              colors={colors}
              icon={(color) => (
                <Ionicons name="arrow-forward" size={20} color={color} />
              )}
            />
          </>
        );
      }}
    </DemoFrame>
  );
}
