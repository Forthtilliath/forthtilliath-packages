/**
 * Props of {@link SlotOrCallback}. `args` is required as soon as the
 * `children` function declares parameters, so a render function can never
 * silently be called without the values it expects.
 */
export type SlotOrCallbackProps<Args extends unknown[] = []> = {
  children: React.ReactNode | ((...args: Args) => React.ReactNode);
} & (Args extends []
  ? {
      /** Arguments passed to `children` when it is a function. */
      args?: Args;
    }
  : {
      /** Arguments passed to `children` when it is a function. */
      args: Args;
    });

/**
 * A component that renders its children if they are a React node, or calls them
 * with `args` if they are a function.
 *
 * @example
 * <SlotOrCallback>
 *   <p>Hello World</p>
 * </SlotOrCallback>
 *
 * @example
 * <SlotOrCallback args={["Ada"]}>
 *   {(name) => <p>Hello {name}!</p>}
 * </SlotOrCallback>
 *
 * @param {SlotOrCallbackProps} props
 * @returns {React.ReactNode}
 */
export function SlotOrCallback<Args extends unknown[] = []>({
  children,
  args,
}: SlotOrCallbackProps<Args>): React.ReactNode {
  if (typeof children === "function") {
    // `args` can only be omitted when `Args` is `[]` (see the props type).
    return children(...((args ?? []) as Args));
  }
  return children;
}
