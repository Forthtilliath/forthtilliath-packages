import { Text, View } from "react-native";
import { describe, expect, it, vi } from "vitest";

import {
  findText,
  parentOf,
  press,
  renderTree,
  styleOf,
  textValues,
} from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { MonthDayGrid } from "./MonthDayGrid.js";

// October 2026 starts on a Thursday.
const days = Array.from(
  { length: 31 },
  (_, i) => `2026-10-${String(i + 1).padStart(2, "0")}`,
);

describe("MonthDayGrid", () => {
  it("shows French weekday initials, then each day number", () => {
    const tree = renderTree(
      <MonthDayGrid days={days} selected={new Set()} onToggle={vi.fn()} />,
    );
    const texts = textValues(tree);
    expect(texts.slice(0, 7)).toEqual(["L", "M", "M", "J", "V", "S", "D"]);
    expect(texts.slice(7, 10)).toEqual([1, 2, 3]);
    expect(texts).toHaveLength(7 + 31);
  });

  it("uses English initials with locale, or custom labels", () => {
    const en = renderTree(
      <MonthDayGrid
        days={days}
        selected={new Set()}
        onToggle={vi.fn()}
        locale="en"
      />,
    );
    expect(textValues(en).slice(0, 2)).toEqual(["M", "T"]);

    const custom = renderTree(
      <MonthDayGrid
        days={days}
        selected={new Set()}
        onToggle={vi.fn()}
        weekdayLabels={["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]}
      />,
    );
    expect(textValues(custom)[0]).toBe("Lu");
  });

  it("offsets the first day under its weekday with blank cells", () => {
    const tree = renderTree(
      <MonthDayGrid days={days} selected={new Set()} onToggle={vi.fn()} />,
    );
    const cells = tree.root
      .findAllByType(View)
      .filter((v) => styleOf(v).width === "14.28%");
    // 7 headers + 3 blanks (Mon–Wed) + 31 days.
    expect(cells).toHaveLength(7 + 3 + 31);
    expect(
      cells.slice(7, 10).every((c) => c.findAllByType(Text).length === 0),
    ).toBe(true);
    expect(cells[10]?.findByType(Text).props.children).toBe(1);
  });

  it("marks selected days and reports taps", () => {
    const onToggle = vi.fn();
    const tree = renderTree(
      <MonthDayGrid
        days={days}
        selected={new Set(["2026-10-11"])}
        onToggle={onToggle}
        styles={{ dayBoxSelected: { backgroundColor: "#ff0000" } }}
      />,
    );
    const eleven = parentOf(findText(tree, 11));
    expect(styleOf(eleven)).toMatchObject({
      borderRadius: 16,
      backgroundColor: "#ff0000",
    });
    expect(
      propsOf<{ accessibilityState: { checked: boolean } }>(eleven)
        .accessibilityState.checked,
    ).toBe(true);
    expect(
      styleOf(parentOf(findText(tree, 12))).backgroundColor,
    ).toBeUndefined();

    press(parentOf(findText(tree, 12)));
    expect(onToggle).toHaveBeenCalledWith("2026-10-12");
  });
});
