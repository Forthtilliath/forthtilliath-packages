import { useEffect, useRef } from "react";

// Déclenche `callback` `delayMs` après le dernier changement parmi `values`,
// en ignorant tout rendu tant qu'au moins une valeur vaut `undefined` (ex: une
// donnée pas encore chargée) et le tout premier rendu où elles le sont toutes
// (pour éviter un déclenchement au montage). Le délai est annulé si une
// nouvelle valeur arrive avant qu'il n'expire (vrai debounce). `values` doit
// avoir la même longueur à chaque rendu, comme pour un tableau de
// dépendances de useEffect classique.
export function useDebouncedChange(
  values: unknown[],
  delayMs: number,
  callback: () => void,
) {
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (values.some((value) => value === undefined)) return;

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    const timeout = setTimeout(callback, delayMs);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps, react-hooks/exhaustive-deps -- `values` IS the dependency list, by design (caller-provided, variable length not expected to change).
  }, values);
}
