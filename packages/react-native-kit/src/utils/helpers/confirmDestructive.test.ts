import { Alert } from "react-native";
import { describe, expect, it, vi } from "vitest";

import { confirmDestructive } from "./confirmDestructive.js";

describe("confirmDestructive", () => {
  it("shows an alert with the title and the default french labels", () => {
    const spy = vi.spyOn(Alert, "alert");
    const onConfirm = vi.fn();

    confirmDestructive("Supprimer ce récipient ?", onConfirm);

    expect(spy).toHaveBeenCalledWith(
      "Supprimer ce récipient ?",
      "Cette action est définitive.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: onConfirm },
      ],
    );
    spy.mockRestore();
  });

  it("calls onConfirm when the destructive button is pressed", () => {
    const spy = vi.spyOn(Alert, "alert");
    const onConfirm = vi.fn();

    confirmDestructive("Titre", onConfirm);
    const buttons = spy.mock.calls[0]?.[2];
    buttons?.find((b) => b.style === "destructive")?.onPress?.();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("accepts a custom message and labels", () => {
    const spy = vi.spyOn(Alert, "alert");

    confirmDestructive("Titre", vi.fn(), {
      message: "Cette recette est utilisée ailleurs.",
      cancelLabel: "Non",
      confirmLabel: "Oui, archiver",
    });

    expect(spy).toHaveBeenCalledWith(
      "Titre",
      "Cette recette est utilisée ailleurs.",
      expect.arrayContaining([
        expect.objectContaining({ text: "Non" }),
        expect.objectContaining({ text: "Oui, archiver" }),
      ]),
    );
    spy.mockRestore();
  });

  it("uses english default labels with locale: 'en', still overridable", () => {
    const spy = vi.spyOn(Alert, "alert");
    const onConfirm = vi.fn();

    confirmDestructive("Delete this item?", onConfirm, {
      locale: "en",
      confirmLabel: "Remove",
    });

    expect(spy).toHaveBeenCalledWith(
      "Delete this item?",
      "This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: onConfirm },
      ],
    );
    spy.mockRestore();
  });
});
