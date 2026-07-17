import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DescriptionDetail,
  DescriptionGroup,
  DescriptionList,
  DescriptionTerm,
} from "@forthtilliath/forth-ui/components/description-list";
import { Badge } from "@forthtilliath/shadcn-ui/components/badge";

/**
 * A description list, with terms and descriptions.
 */
const meta = {
  title: "forth-ui/Data Display/DescriptionList",
  component: DescriptionList,
  args: {
    className: "w-96",
  },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionGroup>
        <DescriptionTerm>Full name</DescriptionTerm>
        <DescriptionDetail>Vincent Dupont</DescriptionDetail>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetail>vincent@acme.dev</DescriptionDetail>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetail>
          <Badge variant="secondary">Active</Badge>
        </DescriptionDetail>
      </DescriptionGroup>
    </DescriptionList>
  ),
} satisfies Meta<typeof DescriptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form — each `DescriptionGroup` pairs one term with its
 * detail, which can hold any content (plain text, a `Badge`, etc).
 */
export const Default: Story = {};
