import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenElements, screenTexts } from "../../__mocks__/screenQueries.js";

import { BottomSheet } from "./BottomSheet.js";

describe("BottomSheet header", () => {
  it("renders no header by default", async () => {
    await render(
      <BottomSheet visible onClose={vi.fn()}>
        <Text>Contenu</Text>
      </BottomSheet>,
    );
    expect(screen.queryByRole("header")).not.toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: "Fermer" }),
    ).not.toBeOnTheScreen();
  });

  it("shows the title and subtitle outside the scrolling content", async () => {
    await render(
      <BottomSheet visible onClose={vi.fn()} title="Filtres" subtitle="12 jeux">
        <Text>Contenu</Text>
      </BottomSheet>,
    );
    expect(screen.getByRole("header", { name: "Filtres" })).toBeOnTheScreen();
    expect(screenTexts()).toEqual(["Filtres", "12 jeux", "Contenu"]);
    const [scroll] = screenElements("ScrollView");
    expect(scroll).not.toHaveTextContent(/Filtres/);
  });

  it("calls the header action and closes with the × button", async () => {
    const onClose = vi.fn();
    const reset = vi.fn();
    await render(
      <BottomSheet
        visible
        onClose={onClose}
        title="Filtres"
        headerAction={{ label: "Réinitialiser", onPress: reset }}
        showCloseButton
      >
        <Text>Contenu</Text>
      </BottomSheet>,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Réinitialiser" }),
    );
    expect(reset).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("names the close button in English or as asked", async () => {
    const { rerender } = await render(
      <BottomSheet visible onClose={vi.fn()} showCloseButton locale="en">
        <Text>x</Text>
      </BottomSheet>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen();
    await rerender(
      <BottomSheet
        visible
        onClose={vi.fn()}
        showCloseButton
        closeLabel="Annuler"
      >
        <Text>x</Text>
      </BottomSheet>,
    );
    expect(screen.getByRole("button", { name: "Annuler" })).toBeOnTheScreen();
  });

  it("shows a grab bar alone, styled through headerStyles", async () => {
    await render(
      <BottomSheet
        visible
        onClose={vi.fn()}
        showHandle
        headerStyles={{ handle: { backgroundColor: "#c9a227" } }}
      >
        <Text>x</Text>
      </BottomSheet>,
    );
    const handle = screenElements("View").find(
      (view) => view.props.importantForAccessibility === "no",
    );
    expect(handle).toHaveStyle({
      width: 40,
      height: 4,
      backgroundColor: "#c9a227",
    });
    expect(screen.queryByRole("header")).not.toBeOnTheScreen();
  });
});
