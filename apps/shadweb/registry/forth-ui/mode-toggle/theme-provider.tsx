"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * `next-themes`' provider behind a `"use client"` boundary, so a Next.js
 * root layout (a Server Component) can render it directly.
 *
 * @example
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   {children}
 * </ThemeProvider>
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
