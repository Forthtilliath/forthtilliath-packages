import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Starts `undefined` (not computed from `window`) on purpose: this hook
  // is used from a "use client" component that Next.js still renders on the
  // server for the initial HTML. Seeding real state from `window.innerWidth`
  // here would make the very first client render disagree with that server
  // markup and trigger a hydration mismatch — so the real value is only
  // read once mounted, below.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${String(MOBILE_BREAKPOINT - 1)}px)`,
    );
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    // eslint-disable-next-line @eslint-react/set-state-in-effect, react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return !!isMobile;
}
