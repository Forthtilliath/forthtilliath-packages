import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { describe, expect, it } from "vitest";

import {
  findText,
  renderTree,
  styleOf,
  textValues,
} from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import {
  SettingsCard,
  SettingsCardHint,
  SettingsCardStatus,
} from "./SettingsCard.js";

describe("SettingsCard", () => {
  it("renders the header, then its content", () => {
    const tree = renderTree(
      <SettingsCard icon="cloud-outline" title="Google Drive">
        <SettingsCardStatus icon="time-outline">
          hier à 21:42
        </SettingsCardStatus>
        <SettingsCardHint>Copie privée</SettingsCardHint>
      </SettingsCard>,
    );

    expect(textValues(tree)).toEqual([
      "Google Drive",
      "hier à 21:42",
      "Copie privée",
    ]);
    expect(
      propsOf<{ accessibilityRole: string }>(findText(tree, "Google Drive"))
        .accessibilityRole,
    ).toBe("header");
    const icons = tree.root
      .findAllByType(Ionicons)
      .map((i) => propsOf<{ name: string; color: string }>(i));
    expect(icons).toEqual([
      expect.objectContaining({ name: "cloud-outline", color: "#2563eb" }),
      expect.objectContaining({ name: "time-outline", color: "#6b7280" }),
    ]);
  });

  it("works without a header icon", () => {
    const tree = renderTree(<SettingsCard title="Compte" />);
    expect(tree.root.findAllByType(Ionicons)).toHaveLength(0);
  });

  it("applies colors and style overrides", () => {
    const tree = renderTree(
      <SettingsCard
        icon="cloud-outline"
        iconColor="#f00"
        title="Drive"
        styles={{ card: { backgroundColor: "#222" }, title: { color: "#fff" } }}
      >
        <SettingsCardStatus
          icon="checkmark-circle"
          iconColor="#0a0"
          styles={{ text: { color: "#eee" } }}
        >
          Relié
        </SettingsCardStatus>
        <SettingsCardHint style={{ color: "#999" }}>Aide</SettingsCardHint>
      </SettingsCard>,
    );

    const [card] = tree.root.findAllByType(View);
    if (!card) throw new Error("no card rendered");
    expect(styleOf(card)).toMatchObject({
      backgroundColor: "#222",
      padding: 16,
    });
    expect(styleOf(findText(tree, "Drive"))).toMatchObject({
      color: "#fff",
      fontWeight: "700",
    });
    expect(styleOf(findText(tree, "Relié"))).toMatchObject({ color: "#eee" });
    expect(styleOf(findText(tree, "Aide"))).toMatchObject({
      color: "#999",
      fontSize: 13,
    });
    const colors = tree.root
      .findAllByType(Ionicons)
      .map((i) => propsOf<{ color: string }>(i).color);
    expect(colors).toEqual(["#f00", "#0a0"]);
    expect(tree.root.findAllByType(Text)).toHaveLength(3);
  });
});
