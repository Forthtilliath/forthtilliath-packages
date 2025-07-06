export interface SlotOrCallbackProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactNode | ((...args: any[]) => React.ReactNode);
}

/**
 * A component that renders its children if they are a React node, or calls them
 * as a function if they are a function.
 *
 * @example
 * <SlotOrCallback>
 *   <p>Hello World</p>
 * </SlotOrCallback>
 *
 * @example
 * <SlotOrCallback>
 *   {(name) => <p>Hello {name}!</p>}
 * </SlotOrCallback>
 *
 * @param {SlotOrCallbackProps} props
 * @returns {React.ReactNode}
 */
export function SlotOrCallback({
  children,
}: SlotOrCallbackProps): React.ReactNode {
  if (typeof children === "function") {
    return children();
  }
  return children;
}
