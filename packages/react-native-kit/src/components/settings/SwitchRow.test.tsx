import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenElements, screenTexts } from "../../__mocks__/screenQueries.js";

import { SwitchRow } from "./SwitchRow.js";

const row = () => screen.getByRole("switch", { name: "Sons" });

/** The native switch inside the row, hidden from screen readers. */
function nativeSwitch() {
  const [element] = screenElements("Switch");
  if (!element) throw new Error("expected the native switch");
  return element;
}

describe("SwitchRow", () => {
  it("toggles from a tap on the row", async () => {
    const onChange = vi.fn();
    await render(<SwitchRow label="Sons" value={false} onChange={onChange} />);
    await fireEvent.press(row());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("forwards the switch's own changes", async () => {
    const onChange = vi.fn();
    await render(<SwitchRow label="Sons" value onChange={onChange} />);
    await fireEvent(nativeSwitch(), "valueChange", false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("announces one switch with its state and description", async () => {
    await render(
      <SwitchRow
        label="Sons"
        description="Bruitage au tirage"
        value
        onChange={vi.fn()}
        disabled
      />,
    );
    expect(screen.getAllByRole("switch")).toHaveLength(1);
    expect(row()).toBeChecked();
    expect(row()).toBeDisabled();
    expect(row()).toHaveProp("accessibilityHint", "Bruitage au tirage");
    expect(screenTexts()).toEqual(["Sons", "Bruitage au tirage"]);
  });

  it("omits the description line when there is none", async () => {
    await render(<SwitchRow label="Sons" value={false} onChange={vi.fn()} />);
    expect(screenTexts()).toEqual(["Sons"]);
  });

  it("applies switch colors by state and style overrides", async () => {
    const colors = {
      trackOff: "#333",
      trackOn: "#0af",
      thumbOff: "#999",
      thumbOn: "#fff",
    };
    const { rerender } = await render(
      <SwitchRow
        label="Sons"
        value
        onChange={vi.fn()}
        colors={colors}
        styles={{ row: { borderWidth: 1 } }}
      />,
    );
    expect(nativeSwitch()).toHaveProp("trackColor", {
      false: "#333",
      true: "#0af",
    });
    expect(nativeSwitch()).toHaveProp("thumbColor", "#fff");
    expect(row()).toHaveStyle({ flexDirection: "row", borderWidth: 1 });

    await rerender(
      <SwitchRow
        label="Sons"
        value={false}
        onChange={vi.fn()}
        colors={colors}
      />,
    );
    expect(nativeSwitch()).toHaveProp("thumbColor", "#999");
  });
});
