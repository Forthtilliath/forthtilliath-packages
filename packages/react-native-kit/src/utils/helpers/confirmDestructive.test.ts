import { Alert } from "react-native";
import { describe, expect, it, vi } from "vitest";

import { confirmDestructive } from "./confirmDestructive.js";

describe("confirmDestructive", () => {
  it("affiche une alerte avec le titre et les libellés par défaut", () => {
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

  it("appelle onConfirm quand le bouton destructif est pressé", () => {
    const spy = vi.spyOn(Alert, "alert");
    const onConfirm = vi.fn();

    confirmDestructive("Titre", onConfirm);
    const buttons = spy.mock.calls[0]?.[2];
    buttons?.find((b) => b.style === "destructive")?.onPress?.();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("accepte un message et des libellés personnalisés", () => {
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
});
