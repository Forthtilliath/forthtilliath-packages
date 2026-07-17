import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pagination } from "@forthtilliath/forth-ui/components/pagination";

/**
 * Navigates between pages of a paginated set, computing the visible page
 * numbers and ellipses itself from `page`/`totalPages`.
 */
const meta = {
  title: "forth-ui/Pagination",
  component: Pagination,
  args: {
    page: 1,
    totalPages: 10,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledPagination({
  page: initialPage,
  ...props
}: Omit<React.ComponentProps<typeof Pagination>, "onPageChange">) {
  const [page, setPage] = React.useState(initialPage);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
}

/**
 * The default form — click a page number or the prev/next arrows.
 */
export const Default: Story = {
  render: (args) => <ControlledPagination {...args} />,
};

/**
 * `showFirstLast` adds buttons that jump straight to page 1 / the last
 * page.
 */
export const WithFirstLast: Story = {
  args: {
    showFirstLast: true,
  },
  render: (args) => <ControlledPagination {...args} />,
};

/**
 * A larger page count shows how the ellipses collapse the middle range.
 */
export const ManyPages: Story = {
  args: {
    totalPages: 50,
    page: 24,
  },
  render: (args) => <ControlledPagination {...args} />,
};

/**
 * `disabled` freezes the control and dims it.
 */
export const Disabled: Story = {
  args: {
    page: 3,
    disabled: true,
  },
};
