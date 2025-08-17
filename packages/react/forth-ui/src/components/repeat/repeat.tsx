import React from "react";

interface Props {
  keyItem?: (i: number) => React.Key;
  count: number;
  children: React.ReactNode | ((index: number) => React.ReactNode);
}

export function Repeat({ keyItem = (i) => i, count, children }: Props) {
  function child(index = 0): React.ReactNode {
    if (typeof children === "function") {
      return children(index);
    }
    return children;
  }

  if (React.Children.count(child()) !== 1) {
    throw new Error("Repeat must have only one child");
  }
  if (!React.isValidElement(child())) {
    throw new Error("Repeat must have a valid child");
  }

  return Array.from({ length: count }).map((_, i) =>
    React.cloneElement(child(i) as React.ReactElement, { key: keyItem(i) })
  );
}
