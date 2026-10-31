import { Ionicons } from "@expo/vector-icons";

import { EmptyState } from "@forthtilliath/react-native-kit/components/feedback/EmptyState";

import { DemoFrame } from "../DemoFrame";
import { app, themed } from "../palette";

export function EmptyStateDemo() {
  return (
    <DemoFrame>
      {(panel) => (
        <EmptyState
          icon={
            <Ionicons
              name="people-outline"
              size={36}
              color={panel === "app" ? app.muted : "#6b7280"}
            />
          }
          title="Aucun joueur"
          message="Ajoute les joueurs une fois : ils seront proposés à chaque partie."
          action={{
            label: "Créer un joueur",
            onPress: () => undefined,
            fullWidth: true,
            colors: themed(panel, {
              primary: app.primary,
              onPrimary: app.onPrimary,
            }),
          }}
          styles={themed(panel, {
            iconWrap: { backgroundColor: app.card },
            title: { color: app.text },
            message: { color: app.muted },
          })}
        />
      )}
    </DemoFrame>
  );
}
