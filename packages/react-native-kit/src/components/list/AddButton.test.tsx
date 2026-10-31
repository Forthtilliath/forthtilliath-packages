import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { AddButton } from "./AddButton.js";

describe("AddButton", () => {
  it("renders its label and reports taps", async () => {
    const onPress = vi.fn();
    await render(<AddButton label="+ Ajouter" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "+ Ajouter" }));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("keeps the dashed border when overriding the button", async () => {
    await render(
      <AddButton
        label="+ Ajouter"
        onPress={vi.fn()}
        styles={{ button: { borderColor: "#444444", marginTop: 12 } }}
      />,
    );
    expect(screen.getByRole("button", { name: "+ Ajouter" })).toHaveStyle({
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: "#444444",
      marginTop: 12,
    });
  });
});
