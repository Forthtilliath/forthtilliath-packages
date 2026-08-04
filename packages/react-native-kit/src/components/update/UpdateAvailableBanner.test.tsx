/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { UpdateAvailableBanner } from "./UpdateAvailableBanner.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("UpdateAvailableBanner", () => {
  it("shows the version and release notes", () => {
    const tree = renderTree(
      <UpdateAvailableBanner
        version="2.0.0"
        notes={"### Added\n- Something new."}
        onPress={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children)
      .flat();
    expect(texts).toContain("Version 2.0.0 disponible");
    expect(texts).toContain("Added");
    expect(texts).toContain("Something new.");
  });

  it("calls onPress when the action button is pressed", () => {
    const onPress = vi.fn();
    const tree = renderTree(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={onPress}
        onDismiss={vi.fn()}
      />,
    );
    const actionButton = tree.root.findAllByType(Pressable)[1];
    if (!actionButton) throw new Error("expected an action button");

    act(() => {
      propsOf<{ onPress: () => void }>(actionButton).onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when the dismiss button is pressed", () => {
    const onDismiss = vi.fn();
    const tree = renderTree(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={vi.fn()}
        onDismiss={onDismiss}
      />,
    );
    const dismissButton = tree.root.findAllByType(Pressable)[0];
    if (!dismissButton) throw new Error("expected a dismiss button");

    act(() => {
      propsOf<{ onPress: () => void }>(dismissButton).onPress();
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("accepts custom labels", () => {
    const tree = renderTree(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={vi.fn()}
        onDismiss={vi.fn()}
        labels={{
          title: (version) => `New version: ${version}`,
          action: "View",
          dismiss: "Close",
        }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("New version: 2.0.0");
    expect(texts).toContain("View");
    expect(texts).toContain("Close");
  });
});
