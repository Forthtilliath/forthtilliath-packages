import { useCallback, useSyncExternalStore } from "react";

/**
 * A store saved on the device whose reading back can be observed — the
 * `persist` API of a Zustand store made with the `persist` middleware has
 * this exact shape. No dependency on Zustand itself.
 */
export interface HydratableStore {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
}

/**
 * `true` once every store in `stores` has been read back from storage
 * (AsyncStorage, MMKV…). Until then, a store holds its initial state: wait
 * for this before acting on saved values — a "last checked" date, a
 * dismissed version, a setting — or the app acts as if nothing was saved.
 *
 * `stores` must keep the same identity between renders (a module constant,
 * or `useMemo`): a new array resubscribes on every render.
 *
 * @param stores - The persisted stores to wait for.
 * @returns Whether all of them have been read back.
 * @example
 * const STORES = [useSettingsStore, useUpdateStore] as const;
 *
 * function UpdateCheck() {
 *   const hydrated = usePersistHydrated(STORES);
 *   return <UpdateNotifier enabled={hydrated} … />;
 * }
 */
export function usePersistHydrated(
  stores: readonly HydratableStore[],
): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const unsubscribers = stores.map((store) =>
        store.persist.onFinishHydration(onChange),
      );
      return () => {
        for (const unsubscribe of unsubscribers) unsubscribe();
      };
    },
    [stores],
  );
  const getSnapshot = () =>
    stores.every((store) => store.persist.hasHydrated());
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
