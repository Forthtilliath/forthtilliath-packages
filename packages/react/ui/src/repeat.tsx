import { SlotOrCallback } from "./slot-or-callback";

export interface RepeatProps {
  children: React.ReactNode | ((index: number) => React.ReactNode);
  count: number;
}

export function Repeat({ count, children }: RepeatProps) {
  if (typeof children === "function") {
    return (
      <>
        {Array.from({ length: count }, (_, index) => (
          <SlotOrCallback key={index}>{children(index)}</SlotOrCallback>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SlotOrCallback key={index}>{children}</SlotOrCallback>
      ))}
    </>
  );
}
