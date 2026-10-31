import { SlotOrCallback } from "./slot-or-callback.js";

/** Props of {@link Repeat}. */
export interface RepeatProps {
  /**
   * What to render each time: a node (repeated as is), or a function receiving
   * the 0-based index.
   */
  children: React.ReactNode | ((index: number) => React.ReactNode);
  /** How many times to render `children`. Defaults to `1`. */
  count?: number;
}

/**
 * Component that repeats content multiple times
 *
 * @component
 * @example
 * // Static mode
 * <Repeat count={3}>
 *   <div>Static Content</div>
 * </Repeat>
 *
 * // Dynamic mode
 * <Repeat count={3}>
 *   {(index) => <div>Dynamic Content - Index: {index}</div>}
 * </Repeat>
 *
 * @param {Object} props - Component props
 * @param {number} [props.count=1] - Number of times to repeat the content
 * @param {ReactNode | ((index: number) => ReactNode)} props.children -
 *   Content to repeat. Can be either a static React component or a function
 *   that takes an index parameter and returns a React component
 *
 * @returns {JSX.Element} A React fragment containing the repeated elements
 */
export function Repeat({ count = 1, children }: RepeatProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SlotOrCallback key={index} args={[index]}>
          {children}
        </SlotOrCallback>
      ))}
    </>
  );
}
