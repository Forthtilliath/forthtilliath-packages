import React from "react";

export interface RepeatProps {
  /**
   * Number of times to repeat the content
   */
  count: number;
  /**
   * Function to generate a unique key for each item
   */
  keyItem?: (index: number) => React.Key;
  /**
   * Function to render each item
   */
  renderItem: (index: number) => React.ReactNode;
}

/**
 * Repeat a component a specified number of times.
 *
 * @param {RepeatProps} props - The props for the Repeat component.
 * @param {number} props.count - The number of times to repeat the component.
 * @param {(index: number) => React.Key} [props.keyItem] - A function to generate a unique key for each item.
 * @param {(index: number) => React.ReactNode} props.renderItem - A function to render each item.
 *
 * @returns {React.ReactNode[]} An array of React components, each rendered with the renderItem function.
 */
export function Repeat({
  count,
  keyItem = (i) => i,
  renderItem,
}: RepeatProps): React.ReactNode[] {
  return Array.from<React.ReactNode>({ length: count }).map((_, i) => (
    <React.Fragment key={keyItem(i)}>{renderItem(i)}</React.Fragment>
  ));
}
