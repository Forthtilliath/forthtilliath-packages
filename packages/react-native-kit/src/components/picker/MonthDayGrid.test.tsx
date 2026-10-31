import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import {
  flattenStyle,
  screenElements,
  screenTexts,
} from "../../__mocks__/screenQueries.js";

import { MonthDayGrid } from "./MonthDayGrid.js";

// October 2026 starts on a Thursday.
const days = Array.from(
  { length: 31 },
  (_, i) => `2026-10-${String(i + 1).padStart(2, "0")}`,
);

const day = (n: number) => screen.getByRole("checkbox", { name: String(n) });

describe("MonthDayGrid", () => {
  it("shows French weekday initials, then each day number", async () => {
    await render(
      <MonthDayGrid days={days} selected={new Set()} onToggle={vi.fn()} />,
    );
    const cells = screenTexts();
    expect(cells.slice(0, 7)).toEqual(["L", "M", "M", "J", "V", "S", "D"]);
    expect(cells.slice(7, 10)).toEqual(["1", "2", "3"]);
    expect(cells).toHaveLength(7 + 31);
  });

  it("uses English initials with locale, or custom labels", async () => {
    const { rerender } = await render(
      <MonthDayGrid
        days={days}
        selected={new Set()}
        onToggle={vi.fn()}
        locale="en"
      />,
    );
    expect(screenTexts().slice(0, 2)).toEqual(["M", "T"]);

    await rerender(
      <MonthDayGrid
        days={days}
        selected={new Set()}
        onToggle={vi.fn()}
        weekdayLabels={["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]}
      />,
    );
    expect(screen.getByText("Lu")).toBeOnTheScreen();
  });

  it("offsets the first day under its weekday with blank cells", async () => {
    await render(
      <MonthDayGrid days={days} selected={new Set()} onToggle={vi.fn()} />,
    );
    const cells = screenElements("View").filter(
      (view) => flattenStyle(view.props.style).width === "14.28%",
    );
    // 7 headers + 3 blanks (Mon–Wed) + 31 days.
    expect(cells).toHaveLength(7 + 3 + 31);
    expect(cells.slice(7, 10).every((cell) => cell.children.length === 0)).toBe(
      true,
    );
    expect(cells[10]).toHaveTextContent("1");
  });

  it("marks selected days and reports taps", async () => {
    const onToggle = vi.fn();
    await render(
      <MonthDayGrid
        days={days}
        selected={new Set(["2026-10-11"])}
        onToggle={onToggle}
        styles={{ dayBoxSelected: { backgroundColor: "#ff0000" } }}
      />,
    );
    expect(day(11)).toBeChecked();
    expect(day(11)).toHaveStyle({
      borderRadius: 16,
      backgroundColor: "#ff0000",
    });
    expect(day(12)).not.toBeChecked();
    expect(day(12)).not.toHaveStyle({ backgroundColor: "#ff0000" });

    await fireEvent.press(day(12));
    expect(onToggle).toHaveBeenCalledWith("2026-10-12");
  });
});
