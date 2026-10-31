import { Animated, Text, View } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mockReduceMotion } from "../../__mocks__/react-native-extra.js";
import {
  flattenStyle,
  screenElements,
  screenTexts,
} from "../../__mocks__/screenQueries.js";
import { EmptyState } from "../feedback/EmptyState.js";

import { Reveal } from "./Reveal.js";
import { Section } from "./Section.js";
import { SectionTitle } from "./SectionTitle.js";

describe("SectionTitle", () => {
  it("is a header in small capitals", async () => {
    await render(<SectionTitle title="Joueurs" />);
    const header = screen.getByRole("header", { name: "Joueurs" });
    expect(header).toHaveStyle({
      textTransform: "uppercase",
      color: "#6b7280",
    });
  });

  it("keeps the case with uppercase={false}", async () => {
    await render(<SectionTitle title="Joueurs" uppercase={false} />);
    expect(screen.getByRole("header")).not.toHaveStyle({
      textTransform: "uppercase",
    });
  });

  it("shows a string aside and a custom node aside", async () => {
    const { rerender } = await render(
      <SectionTitle title="Joueurs" aside="4 joueurs" />,
    );
    expect(screen.getByText("4 joueurs")).toHaveStyle({ marginLeft: "auto" });

    await rerender(<SectionTitle title="Joueurs" aside={<Text>badge</Text>} />);
    expect(screen.getByText("badge")).toBeOnTheScreen();
  });

  it("draws a rule and hides the leading mark from screen readers", async () => {
    await render(
      <SectionTitle
        title="Merveilles"
        rule
        leading={<View testID="diamond" />}
        styles={{ rule: { backgroundColor: "#c9a227" } }}
      />,
    );
    expect(screen.queryByTestId("diamond")).not.toBeOnTheScreen();
    expect(
      screen.getByTestId("diamond", { includeHiddenElements: true }),
    ).toBeTruthy();
    const rule = screenElements("View").find(
      (view) => flattenStyle(view.props.style).height === 1,
    );
    expect(rule).toHaveStyle({
      flex: 1,
      height: 1,
      backgroundColor: "#c9a227",
    });
  });
});

describe("Section", () => {
  it("renders the title then the content, spaced by gap", async () => {
    await render(
      <Section title="Durée" aside="Courte" gap={12}>
        <Text>contenu</Text>
      </Section>,
    );
    expect(screenTexts()).toEqual(["Durée", "Courte", "contenu"]);
    expect(screen.root).toHaveStyle({ gap: 12 });
  });
});

describe("Reveal", () => {
  afterEach(() => {
    mockReduceMotion.value = false;
  });

  it("starts hidden and fades in after index × staggerMs", async () => {
    const timing = vi.spyOn(Animated, "timing");
    await render(
      <Reveal index={2} staggerMs={100} durationMs={300}>
        <Text>1er</Text>
      </Reveal>,
    );
    expect(screen.getByText("1er")).toBeOnTheScreen();
    expect(screen.root).toHaveStyle({ opacity: 0 });
    expect(timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        toValue: 1,
        delay: 200,
        duration: 300,
        useNativeDriver: true,
      }),
    );
    timing.mockRestore();
  });

  it("springs in with emphasis", async () => {
    const spring = vi.spyOn(Animated, "spring");
    await render(
      <Reveal emphasis>
        <Text>vainqueur</Text>
      </Reveal>,
    );
    expect(spring).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 1, delay: 0 }),
    );
    spring.mockRestore();
  });

  it("shows the content at once when animations are removed", async () => {
    mockReduceMotion.value = true;
    await render(
      <Reveal emphasis>
        <Text>vainqueur</Text>
      </Reveal>,
    );
    expect(screen.root).toHaveStyle({ opacity: 1 });
  });
});

describe("EmptyState", () => {
  it("shows the icon (hidden from screen readers), title and message", async () => {
    await render(
      <EmptyState
        icon={<View testID="icon" />}
        title="Aucun joueur"
        message="Ajoute un joueur."
      />,
    );
    expect(
      screen.getByRole("header", { name: "Aucun joueur" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Ajoute un joueur.")).toBeOnTheScreen();
    expect(screen.queryByTestId("icon")).not.toBeOnTheScreen();
  });

  it("renders the action as a kit Button", async () => {
    const onPress = vi.fn();
    await render(
      <EmptyState
        message="Vide."
        action={{ label: "Créer", onPress, variant: "outline" }}
      />,
    );
    const { fireEvent } = await import("@testing-library/react-native");
    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
