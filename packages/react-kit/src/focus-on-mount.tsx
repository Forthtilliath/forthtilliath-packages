import { type ReactNode, useEffect, useRef } from "react";

export interface FocusOnMountProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

/**
 * A focusable wrapper that takes focus on mount, without scrolling the page.
 * Useful to move focus to a freshly rendered content area (search results, an
 * error message) so screen readers announce it.
 *
 * @example
 * <FocusOnMount label="Search results">
 *   <p>3 results found</p>
 * </FocusOnMount>
 *
 * @param {FocusOnMountProps} props
 * @returns {React.ReactNode}
 */
export function FocusOnMount({
  children,
  className,
  label,
}: FocusOnMountProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-label={label}
      className={className}
    >
      {children}
    </div>
  );
}
