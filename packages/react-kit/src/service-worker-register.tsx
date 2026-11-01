"use client";

import {
  useServiceWorker,
  type UseServiceWorkerOptions,
} from "./useServiceWorker.js";

/** Props of {@link ServiceWorkerRegister}. */
export interface ServiceWorkerRegisterProps extends UseServiceWorkerOptions {
  /** The worker's URL, served from the site's origin (e.g. `"/sw.js"`). */
  src: string;
}

/**
 * {@link useServiceWorker} as a component that renders nothing, to drop in a
 * server layout (a Next.js `app/layout.tsx`) without writing a client
 * component.
 *
 * @example
 * <body>
 *   <ServiceWorkerRegister src="/sw.js" />
 *   {children}
 * </body>
 */
export function ServiceWorkerRegister({
  src,
  ...options
}: ServiceWorkerRegisterProps): null {
  useServiceWorker(src, options);
  return null;
}
