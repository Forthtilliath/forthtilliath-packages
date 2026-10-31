import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { KitLocaleProvider } from "../../i18n/KitLocaleProvider.js";

import { UndoToast } from "./UndoToast.js";

describe("UndoToast", () => {
  it("renders the message", async () => {
    await render(
      <UndoToast message="« Marie » supprimée" onAction={vi.fn()} />,
    );
    expect(screen.getByText("« Marie » supprimée")).toBeOnTheScreen();
  });

  it('defaults the action label to "Annuler"', async () => {
    await render(<UndoToast message="x" onAction={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Annuler" })).toBeOnTheScreen();
  });

  it('defaults to "Undo" with locale="en", or under an English provider', async () => {
    const { rerender } = await render(
      <UndoToast message="x" locale="en" onAction={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Undo" })).toBeOnTheScreen();

    await rerender(
      <KitLocaleProvider locale="en">
        <UndoToast message="x" onAction={vi.fn()} />
      </KitLocaleProvider>,
    );
    expect(screen.getByRole("button", { name: "Undo" })).toBeOnTheScreen();
  });

  it("uses a custom action label, whatever the locale", async () => {
    await render(
      <UndoToast
        message="x"
        actionLabel="Rétablir"
        locale="en"
        onAction={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Rétablir" })).toBeOnTheScreen();
    expect(screen.queryByText("Undo")).not.toBeOnTheScreen();
  });

  it("calls onAction when the button is pressed", async () => {
    const onAction = vi.fn();
    await render(<UndoToast message="x" onAction={onAction} />);
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("truncates the message to a single line", async () => {
    await render(<UndoToast message="x" onAction={vi.fn()} />);
    expect(screen.getByText("x")).toHaveProp("numberOfLines", 1);
  });

  it("keeps the default floating-bar layout", async () => {
    await render(<UndoToast message="x" onAction={vi.fn()} />);
    expect(screen.root).toHaveStyle({
      position: "absolute",
      bottom: 24,
      flexDirection: "row",
    });
  });

  it("keeps the rest of a slot's default when overriding one property", async () => {
    await render(
      <UndoToast
        message="x"
        onAction={vi.fn()}
        styles={{ toast: { backgroundColor: "#0a0a0a" } }}
      />,
    );
    expect(screen.root).toHaveStyle({
      position: "absolute",
      bottom: 24,
      backgroundColor: "#0a0a0a",
    });
  });

  it("applies message and action style overrides", async () => {
    await render(
      <UndoToast
        message="hello"
        onAction={vi.fn()}
        styles={{
          message: { color: "#111111" },
          action: { color: "#2563eb" },
        }}
      />,
    );
    expect(screen.getByText("hello")).toHaveStyle({
      flex: 1,
      color: "#111111",
    });
    expect(screen.getByText("Annuler")).toHaveStyle({
      fontWeight: "700",
      color: "#2563eb",
    });
  });
});
