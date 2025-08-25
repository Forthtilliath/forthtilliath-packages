import type { GridProps } from "@forthtilliath/forth-ui/components/grid";
import { Grid } from "@forthtilliath/forth-ui/components/grid";
import type {
  StoryComponent,
  StoryDecorator,
  UnknownRecord,
} from "@forthtilliath/types";

export function decoratorGroupStories<T extends UnknownRecord>(
  commonProps: Partial<T>,
  variants: { [K in keyof T]?: T[K][] },
  gridProps: Omit<GridProps, "children"> = {}
): StoryDecorator<T> {
  gridProps.cols ??= 1;

  return function DecoratedStory(Story: StoryComponent<T>) {
    const stories = cartesianProductOfObjects(variants);

    return (
      <Grid {...gridProps}>
        {stories.map((props, index) => (
          <Story
            key={`story-${index.toString()}`}
            args={{
              ...commonProps,
              ...props,
            }}
          />
        ))}
      </Grid>
    );
  };
}

function cartesianProductOfObjects<T extends { [K in keyof T]?: T[K] }>(
  options: T
): T[] {
  const props = Object.entries(options as Record<string, T[keyof T][]>);
  if (props.length === 0) return [];

  return props.reduce<T[]>(
    (acc, [key, values]) => {
      return acc.flatMap<T>((obj) => {
        return values.map((value) => ({
          ...obj,
          [key]: value,
        }));
      });
    },
    [{} as T]
  );
}
