import type * as React from "react";

import { cn } from "@/lib/utils";

export type ThemeImageProps<C extends React.ElementType = "img"> = {
  /** Image component to render, e.g. Next.js' `Image`. @default "img" */
  as?: C;
  /** Shown in light mode. */
  srcLight: string;
  /** Shown in dark mode (the `dark` variant, e.g. a `.dark` root class). */
  srcDark: string;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "src" | "className">;

/**
 * An image with a light and a dark version, switched by Tailwind's `dark`
 * variant — both are rendered, one is hidden, so it works without any
 * JavaScript (and without a flash on load).
 *
 * @example
 * <ThemeImage as={Image} srcLight="/logo.svg" srcDark="/logo-dark.svg"
 *   alt="Logo" width={180} height={38} />
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ThemeImage<C extends React.ElementType = "img">({
  as,
  srcLight,
  srcDark,
  className,
  ...props
}: ThemeImageProps<C>) {
  const Component: React.ElementType = as ?? "img";

  return (
    <>
      <Component
        {...props}
        src={srcLight}
        className={cn(className, "dark:hidden")}
      />
      <Component
        {...props}
        src={srcDark}
        className={cn(className, "hidden dark:block")}
      />
    </>
  );
}
