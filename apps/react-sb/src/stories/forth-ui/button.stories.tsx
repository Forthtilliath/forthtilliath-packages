import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Underline } from "lucide-react";

import {
  Button,
  ButtonGroup,
  type ButtonSizeVariants,
} from "@forthtilliath/forth-ui/components/button";
import { Grid } from "@forthtilliath/forth-ui/components/grid";

/**
 * Displays a button or a component that looks like a button.
 */
const meta = {
  title: "forth-ui/Button",
  component: Button,
  argTypes: {
    variant: {
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
      control: { type: "select" },
    },
    size: {
      options: [
        "xs",
        "sm",
        "default",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
      control: { type: "select" },
    },
    shape: {
      options: ["default", "pill"],
      control: { type: "radio" },
    },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    shape: "default",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the button.
 */
export const Default: Story = {};

/**
 * shadcn-ui's own color variants, unchanged — forth-ui's Button doesn't
 * need to add more, every reference source confirmed this set already
 * covers it.
 */
export const Variants: Story = {
  render: () => (
    <Grid cols={6}>
      {(
        [
          "default",
          "secondary",
          "destructive",
          "outline",
          "ghost",
          "link",
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </Grid>
  ),
};

/**
 * Use the `size` prop for the full scale, including the `icon-*` sizes
 * missing from the underlying shadcn-ui primitive (only default/sm/lg/icon
 * there).
 */
export const Sizes: Story = {
  render: () => {
    const sizes: NonNullable<ButtonSizeVariants["size"]>[] = [
      "xs",
      "sm",
      "default",
      "lg",
    ];
    const iconSizes: NonNullable<ButtonSizeVariants["size"]>[] = [
      "icon-xs",
      "icon-sm",
      "icon",
      "icon-lg",
    ];
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {iconSizes.map((size) => (
            <Button key={size} size={size} aria-label={size}>
              <Bold />
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Use the `shape="pill"` prop for fully rounded corners.
 */
export const Pill: Story = {
  args: {
    shape: "pill",
  },
};

/**
 * Use the `loading` prop to show a spinner and disable the button — the
 * caller controls when it starts/stops, pairing with your own async state.
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * Use `ButtonGroup` to join buttons into a single visually connected row.
 */
export const Group: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Bold">
        <Bold />
      </Button>
      <Button variant="outline" size="icon" aria-label="Italic">
        <Italic />
      </Button>
      <Button variant="outline" size="icon" aria-label="Underline">
        <Underline />
      </Button>
    </ButtonGroup>
  ),
};
