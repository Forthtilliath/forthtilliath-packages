import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenTexts } from "../../__mocks__/screenQueries.js";

import { BackgroundPicker } from "./BackgroundPicker.js";
import { findBackground } from "./findBackground.js";

const OPTIONS = [
  { id: "night", label: "Bleu nuit", page: "#0f172a", card: "#1e293b" },
  {
    id: "felt",
    label: "Tapis vert",
    page: "#0b1f15",
    card: "#112c1e",
    cardBorder: "#315c45",
  },
];

const radio = (name: string) => screen.getByRole("radio", { name });

describe("BackgroundPicker", () => {
  it("draws one radio per option, the chosen one checked", async () => {
    await render(
      <BackgroundPicker options={OPTIONS} value="felt" onChange={vi.fn()} />,
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(radio("Bleu nuit")).not.toBeChecked();
    expect(radio("Tapis vert")).toBeChecked();
    expect(screenTexts()).toEqual(["Bleu nuit", "Tapis vert"]);
  });

  it("paints each swatch with its page and card colours", async () => {
    await render(
      <BackgroundPicker options={OPTIONS} value="night" onChange={vi.fn()} />,
    );
    const [swatch, card] = radio("Tapis vert").queryAll(
      (node) => node.type === "View",
    );
    expect(swatch).toHaveStyle({ backgroundColor: "#0b1f15" });
    expect(card).toHaveStyle({
      backgroundColor: "#112c1e",
      borderColor: "#315c45",
    });
  });

  it("hands the pressed option to onChange", async () => {
    const onChange = vi.fn();
    await render(
      <BackgroundPicker options={OPTIONS} value="night" onChange={onChange} />,
    );
    await fireEvent.press(radio("Tapis vert"));
    expect(onChange).toHaveBeenCalledWith(OPTIONS[1]);
  });
});

describe("findBackground", () => {
  it("finds the option by id", () => {
    expect(findBackground(OPTIONS, "felt")).toBe(OPTIONS[1]);
  });

  it("falls back to the first option for an unknown or missing id", () => {
    expect(findBackground(OPTIONS, "removed")).toBe(OPTIONS[0]);
    expect(findBackground(OPTIONS, undefined)).toBe(OPTIONS[0]);
  });

  it("throws without any option", () => {
    expect(() => findBackground([], "night")).toThrow(RangeError);
  });
});
