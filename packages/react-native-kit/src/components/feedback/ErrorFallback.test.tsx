import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenElements, screenTexts } from "../../__mocks__/screenQueries.js";

import { ErrorFallback } from "./ErrorFallback.js";

const error = new Error("boom");

describe("ErrorFallback", () => {
  it("shows the French texts and the error message by default", async () => {
    await render(<ErrorFallback error={error} retry={vi.fn()} />);
    expect(screenTexts()).toEqual([
      "😕",
      "Une erreur est survenue",
      "Désolé, quelque chose s'est mal passé. Réessaie ci-dessous.",
      "Réessayer",
      "boom",
    ]);
  });

  it("switches to English with locale, and accepts custom texts", async () => {
    await render(
      <ErrorFallback
        error={error}
        retry={vi.fn()}
        locale="en"
        labels={{ hint: "Your data is safe." }}
      />,
    );
    expect(screenTexts()).toEqual([
      "😕",
      "Something went wrong",
      "Your data is safe.",
      "Try again",
      "boom",
    ]);
  });

  it("retries on the button", async () => {
    const retry = vi.fn();
    await render(<ErrorFallback error={error} retry={retry} />);
    await fireEvent.press(screen.getByRole("button", { name: "Réessayer" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("can hide the details box", async () => {
    await render(
      <ErrorFallback error={error} retry={vi.fn()} showDetails={false} />,
    );
    expect(screenElements("ScrollView")).toHaveLength(0);
    expect(screen.queryByText("boom")).not.toBeOnTheScreen();
  });

  it("merges style overrides slot by slot", async () => {
    await render(
      <ErrorFallback
        error={error}
        retry={vi.fn()}
        styles={{ title: { color: "#fafafa" } }}
      />,
    );
    expect(screen.getByText("Une erreur est survenue")).toHaveStyle({
      fontSize: 20,
      textAlign: "center",
      color: "#fafafa",
    });
  });
});
