import { useState } from "react";
import { Text, View } from "react-native";

import { ReorderList } from "@forthtilliath/react-native-kit/components/list/ReorderList";

import { DemoFrame } from "../DemoFrame";
import { app, type Panel, themed } from "../palette";

const PLAYERS = [
  { id: "1", name: "Alice", color: "#E08A5C" },
  { id: "2", name: "Bruno", color: "#7FB069" },
  { id: "3", name: "Chloé", color: "#6CA6CD" },
  { id: "4", name: "David", color: "#C38FD0" },
];

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#1C1612", fontWeight: "700" }}>{name[0]}</Text>
    </View>
  );
}

function Order({ panel }: { panel: Panel }) {
  const [players, setPlayers] = useState(PLAYERS);
  return (
    <ReorderList
      items={players}
      keyExtractor={(p) => p.id}
      getLabel={(p) => p.name}
      onChange={setPlayers}
      renderItem={
        panel === "app"
          ? (p) => (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Avatar name={p.name} color={p.color} />
                <Text style={{ color: app.text, fontSize: 15 }}>{p.name}</Text>
              </View>
            )
          : undefined
      }
      styles={themed(panel, {
        row: { backgroundColor: app.card },
        position: { color: app.muted },
        arrowColor: app.text,
      })}
    />
  );
}

export function ReorderListDemo() {
  return <DemoFrame>{(panel) => <Order panel={panel} />}</DemoFrame>;
}
