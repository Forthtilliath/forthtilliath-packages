import { useRef, useState } from "react";

// Empêche un second appel pendant qu'un premier est encore en cours (ex:
// double-tap sur un bouton "Enregistrer" avant qu'il n'ait eu le temps de se
// désactiver, qui créerait plusieurs soumissions identiques). Le verrou est un
// ref et non le state `isSaving` : deux taps traités avant le re-rendu
// verraient encore tous les deux l'ancienne valeur `false` du state.
export function useSubmitGuard() {
  const [isSaving, setIsSaving] = useState(false);
  const inFlightRef = useRef(false);

  async function guard(action: () => Promise<void>) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);
    try {
      await action();
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  }

  return { isSaving, guard };
}
