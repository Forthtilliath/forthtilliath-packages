import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { DragHandle } from "./DragHandle.js";

describe("DragHandle", () => {
  it("starts the drag on press-in", async () => {
    const onPressIn = vi.fn();
    await render(
      <DragHandle onPressIn={onPressIn} accessibilityLabel="Déplacer Marie" />,
    );
    await fireEvent(
      screen.getByRole("button", { name: "Déplacer Marie" }),
      "pressIn",
    );
    expect(onPressIn).toHaveBeenCalledOnce();
  });

  it("forwards disabled and merges the glyph style", async () => {
    await render(
      <DragHandle
        onPressIn={vi.fn()}
        disabled
        accessibilityLabel="x"
        styles={{ text: { color: "#eeeeee" } }}
      />,
    );
    expect(screen.getByRole("button", { name: "x" })).toBeDisabled();
    expect(screen.getByText("⠿")).toHaveStyle({
      fontSize: 20,
      opacity: 0.5,
      color: "#eeeeee",
    });
  });
});
