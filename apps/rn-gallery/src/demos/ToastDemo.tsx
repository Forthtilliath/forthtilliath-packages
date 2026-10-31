import { useEffect } from "react";
import { Text, View } from "react-native";

import {
  showToast,
  type ToastOptions,
} from "@forthtilliath/react-native-kit/components/feedback/toast";
import { ToastHost } from "@forthtilliath/react-native-kit/components/feedback/ToastHost";

import { DemoFrame } from "../DemoFrame";
import { app, type Panel } from "../palette";

const STAY = 10 * 60 * 1000;

function FakeList({ panel }: { panel: Panel }) {
  const row = {
    padding: 14,
    borderRadius: 12,
    backgroundColor: panel === "app" ? app.card : "#f1f5f9",
  };
  const text = { color: panel === "app" ? app.text : "#111111", fontSize: 15 };
  return (
    <View style={{ gap: 8 }}>
      {["Alice", "Bruno", "Chloé"].map((name) => (
        <View key={name} style={row}>
          <Text style={text}>{name}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Shows a toast once mounted. Sibling effects run in order, so placed right
 * after its panel's host, it reaches that host before the next panel's one
 * registers (toasts go to the most recently registered host).
 */
function ShowOnMount({
  message,
  options,
}: {
  message: string;
  options: ToastOptions;
}) {
  useEffect(() => {
    showToast(message, options);
  }, [message, options]);
  return null;
}

const UNDO: ToastOptions = {
  durationMs: STAY,
  action: { label: "Annuler", onPress: () => undefined },
};
const PLAIN: ToastOptions = { durationMs: STAY };

export function ToastDemo() {
  return (
    <DemoFrame height={300}>
      {(panel) => (
        <>
          <FakeList panel={panel} />
          {panel === "default" ? (
            <>
              <ToastHost />
              <ShowOnMount message="Partie enregistrée" options={PLAIN} />
            </>
          ) : (
            <>
              <ToastHost
                styles={{
                  toast: { backgroundColor: app.text },
                  message: { color: app.background },
                  action: { color: "#9A3F14" },
                }}
              />
              <ShowOnMount message="« Marie » supprimée" options={UNDO} />
            </>
          )}
        </>
      )}
    </DemoFrame>
  );
}
