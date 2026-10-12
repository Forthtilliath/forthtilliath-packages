import { ScrollView } from "react-native";
import { describe, expect, it, vi } from "vitest";

import {
  findText,
  parentOf,
  press,
  renderTree,
  styleOf,
  textValues,
} from "../../__mocks__/renderTree.js";

import { ErrorFallback } from "./ErrorFallback.js";

const error = new Error("boom");

describe("ErrorFallback", () => {
  it("shows the French texts and the error message by default", () => {
    const tree = renderTree(<ErrorFallback error={error} retry={vi.fn()} />);
    expect(textValues(tree)).toEqual([
      "😕",
      "Une erreur est survenue",
      "Désolé, quelque chose s'est mal passé. Réessaie ci-dessous.",
      "Réessayer",
      "boom",
    ]);
  });

  it("switches to English with locale, and accepts custom texts", () => {
    const tree = renderTree(
      <ErrorFallback
        error={error}
        retry={vi.fn()}
        locale="en"
        labels={{ hint: "Your data is safe." }}
      />,
    );
    expect(textValues(tree)).toEqual([
      "😕",
      "Something went wrong",
      "Your data is safe.",
      "Try again",
      "boom",
    ]);
  });

  it("retries on the button", () => {
    const retry = vi.fn();
    const tree = renderTree(<ErrorFallback error={error} retry={retry} />);
    press(parentOf(findText(tree, "Réessayer")));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("can hide the details box", () => {
    const tree = renderTree(
      <ErrorFallback error={error} retry={vi.fn()} showDetails={false} />,
    );
    expect(tree.root.findAllByType(ScrollView)).toHaveLength(0);
    expect(textValues(tree)).not.toContain("boom");
  });

  it("merges style overrides slot by slot", () => {
    const tree = renderTree(
      <ErrorFallback
        error={error}
        retry={vi.fn()}
        styles={{ title: { color: "#fafafa" } }}
      />,
    );
    expect(styleOf(findText(tree, "Une erreur est survenue"))).toMatchObject({
      fontSize: 20,
      textAlign: "center",
      color: "#fafafa",
    });
  });
});
