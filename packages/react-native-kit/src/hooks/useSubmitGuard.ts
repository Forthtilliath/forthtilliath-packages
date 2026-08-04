import { useState } from "react";

// Empêche un second appel pendant qu'un premier est encore en cours (ex:
// double-tap sur un bouton "Enregistrer" avant qu'il n'ait eu le temps de se
// désactiver, qui créerait plusieurs soumissions identiques).
export function useSubmitGuard() {
  const [isSaving, setIsSaving] = useState(false);

  async function guard(action: () => Promise<void>) {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await action();
    } finally {
      setIsSaving(false);
    }
  }

  return { isSaving, guard };
}
