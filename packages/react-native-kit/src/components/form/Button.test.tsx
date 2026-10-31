import { Text } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { flattenStyle, screenElements } from "../../__mocks__/screenQueries.js";

import { Button } from "./Button.js";

function deferred() {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Button", () => {
  it("is a button named after its label, calling onPress", async () => {
    const onPress = vi.fn();
    await render(<Button label="Enregistrer" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("uses accessibilityLabel and accessibilityHint when given", async () => {
    await render(
      <Button
        label="+"
        accessibilityLabel="Ajouter un joueur"
        accessibilityHint="Ouvre le formulaire"
      />,
    );
    const button = screen.getByRole("button", { name: "Ajouter un joueur" });
    expect(button).toHaveProp("accessibilityHint", "Ouvre le formulaire");
  });

  it("ignores presses while disabled", async () => {
    const onPress = vi.fn();
    await render(<Button label="OK" disabled onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows a spinner and is busy while loading", async () => {
    const onPress = vi.fn();
    await render(<Button label="OK" loading onPress={onPress} />);
    expect(screenElements("ActivityIndicator")).toHaveLength(1);
    expect(screen.getByRole("button")).toBeBusy();
    await fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("blocks a second press until the returned promise settles", async () => {
    const task = deferred();
    const onPress = vi.fn(() => task.promise);
    await render(<Button label="Envoyer" onPress={onPress} />);
    const button = screen.getByRole("button");

    await fireEvent.press(button);
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(button).toBeBusy();

    await act(async () => {
      task.resolve();
      await task.promise;
    });
    expect(button).not.toBeBusy();
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("hands a rejection to onError and becomes pressable again", async () => {
    const task = deferred();
    const onError = vi.fn();
    await render(
      <Button label="Envoyer" onPress={() => task.promise} onError={onError} />,
    );
    await fireEvent.press(screen.getByRole("button"));
    await act(async () => {
      task.reject(new Error("réseau"));
      await task.promise.catch(() => undefined);
    });
    expect(onError).toHaveBeenCalledWith(new Error("réseau"));
    expect(screen.getByRole("button")).not.toBeBusy();
  });

  it("colors each variant from the palette", async () => {
    const colors = {
      primary: "#111111",
      onPrimary: "#fefefe",
      danger: "#aa0000",
    };
    const { rerender } = await render(<Button label="A" colors={colors} />);
    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "#111111",
    });
    expect(screen.getByText("A")).toHaveStyle({ color: "#fefefe" });

    await rerender(<Button label="A" variant="outline" colors={colors} />);
    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "transparent",
      borderColor: "#111111",
    });
    expect(screen.getByText("A")).toHaveStyle({ color: "#111111" });

    await rerender(<Button label="A" variant="danger" colors={colors} />);
    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "#aa0000",
    });
  });

  it("applies the size, full width and style overrides", async () => {
    await render(
      <Button
        label="A"
        size="lg"
        fullWidth
        styles={{ button: { borderRadius: 4 }, label: { letterSpacing: 1 } }}
      />,
    );
    expect(screen.getByRole("button")).toHaveStyle({
      minHeight: 56,
      alignSelf: "stretch",
      borderRadius: 4,
      borderWidth: 1.5,
    });
    expect(screen.getByText("A")).toHaveStyle({
      fontSize: 17,
      letterSpacing: 1,
    });
  });

  it("renders an icon function with the label color, at the end if asked", async () => {
    const icon = vi.fn((color: unknown) => (
      <Text>{`icon:${String(color)}`}</Text>
    ));
    await render(
      <Button
        label="Suivant"
        icon={icon}
        iconPosition="end"
        colors={{ onPrimary: "#ffffff" }}
      />,
    );
    expect(screen.getByText("icon:#ffffff")).toBeOnTheScreen();
    const content = screenElements("View").find(
      (view) => flattenStyle(view.props.style).flexDirection === "row-reverse",
    );
    expect(content).toBeDefined();
  });

  it("draws a background under the label", async () => {
    await render(<Button label="A" background={<Text>gradient</Text>} />);
    expect(screen.getByText("gradient")).toBeOnTheScreen();
  });
});
