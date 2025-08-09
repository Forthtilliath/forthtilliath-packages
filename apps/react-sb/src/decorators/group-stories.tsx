import React from "react";

type Args = Record<string, unknown>;
type StoryFn<T = Args> = (args: StoryPropsWithKey<T>) => React.JSX.Element;
interface StoryPropsWithKey<T> {
  key: number;
  args: Partial<T>;
}

export function decoratorGroupStories<P extends Record<string, unknown>>(
  commonProps: Partial<P>,
  variants: { [K in keyof P]?: P[K][] }
): (Story: StoryFn<P>) => React.JSX.Element {
  return function DecoratedStory(Story: StoryFn<P>) {
    const stories = cartesianProductOfObjects(variants);

    return (
      <div className="flex flex-wrap gap-4">
        {stories.map((props, index) => (
          <Story
            key={index}
            args={{
              ...commonProps,
              ...props,
            }}
          />
        ))}
      </div>
    );
  };
}

function cartesianProductOfObjects<T extends { [K in keyof T]?: T[K] }>(
  options: T
): { [K in keyof T]: NonNullable<T[K]> }[] {
  const props = Object.entries(options as Record<string, T[keyof T][]>);
  if (props.length === 0) return [];

  return props.reduce<{ [K in keyof T]: NonNullable<T[K]> }[]>(
    (acc, [key, values]) => {
      return acc.flatMap<{ [K in keyof T]: NonNullable<T[K]> }>((obj) => {
        return values.map((value) => ({
          ...obj,
          [key]: value,
        }));
      });
    },
    [{} as { [K in keyof T]: NonNullable<T[K]> }]
  );
}
