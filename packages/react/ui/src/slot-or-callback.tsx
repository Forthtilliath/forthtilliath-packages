export interface SlotOrCallbackProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactNode | ((...args: any[]) => React.ReactNode);
}

export function SlotOrCallback({ children }: SlotOrCallbackProps) {
  if (typeof children === "function") {
    return children();
  }
  return children;
}
