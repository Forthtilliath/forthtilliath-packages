"use client";

import { useEffect, useRef } from "react";

/** Options of {@link useServiceWorker}. */
export interface UseServiceWorkerOptions extends RegistrationOptions {
  /** Set to `false` to skip the registration (e.g. in development). */
  enabled?: boolean;
  /**
   * Called when the registration fails. By default the failure is ignored:
   * the app keeps working, only without its offline mode.
   */
  onError?: (error: unknown) => void;
}

/**
 * Registers a service worker once the page is mounted, when the browser
 * supports them (a PWA's offline mode, cache, push…). Does nothing on the
 * server or in browsers without `navigator.serviceWorker`.
 *
 * @param scriptUrl - The worker's URL, served from the site's origin (e.g. `"/sw.js"`).
 * @param options - `scope`, `type`, `updateViaCache`, plus `enabled` and `onError`.
 * @example
 * useServiceWorker("/sw.js", { enabled: process.env.NODE_ENV === "production" });
 */
export function useServiceWorker(
  scriptUrl: string,
  { enabled = true, onError, ...registration }: UseServiceWorkerOptions = {},
): void {
  // Read through refs so inline options don't register again on each render.
  const onErrorRef = useRef(onError);
  const registrationRef = useRef(registration);
  useEffect(() => {
    onErrorRef.current = onError;
    registrationRef.current = registration;
  });

  useEffect(() => {
    if (!enabled || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register(scriptUrl, registrationRef.current)
      .catch((error: unknown) => {
        onErrorRef.current?.(error);
      });
  }, [scriptUrl, enabled]);
}
