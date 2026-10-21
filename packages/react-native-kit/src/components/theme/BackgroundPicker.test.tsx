/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Pressable, Text, View } from "react-native";
import { describe, expect, it, vi } from "vitest";

import { press, renderTree, styleOf } from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { BackgroundPicker, findBackground } from "./BackgroundPicker.js";

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

describe("BackgroundPicker", () => {
  it("draws one radio per option, the chosen one checked", () => {
    const tree = renderTree(
      <BackgroundPicker options={OPTIONS} value="felt" onChange={vi.fn()} />,
    );
    const radios = tree.root.findAllByType(Pressable);
    expect(
      radios.map(
        (r) =>
          propsOf<{ accessibilityState: { checked: boolean } }>(r)
            .accessibilityState.checked,
      ),
    ).toEqual([false, true]);
    expect(
      tree.root.findAllByType(Text).map((t) => t.props.children as string),
    ).toEqual(["Bleu nuit", "Tapis vert"]);
  });

  it("paints each swatch with its page and card colours", () => {
    const tree = renderTree(
      <BackgroundPicker options={OPTIONS} value="night" onChange={vi.fn()} />,
    );
    const [, felt] = tree.root.findAllByType(Pressable);
    if (!felt) throw new Error("expected two options");
    const [swatch, card] = felt.findAllByType(View);
    if (!swatch || !card) throw new Error("expected a swatch and a card");
    expect(styleOf(swatch)).toMatchObject({ backgroundColor: "#0b1f15" });
    expect(styleOf(card)).toMatchObject({
      backgroundColor: "#112c1e",
      borderColor: "#315c45",
    });
  });

  it("hands the pressed option to onChange", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <BackgroundPicker options={OPTIONS} value="night" onChange={onChange} />,
    );
    const [, felt] = tree.root.findAllByType(Pressable);
    if (!felt) throw new Error("expected two options");
    press(felt);
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
