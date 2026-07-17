import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { InfiniteScroll } from "@forthtilliath/forth-ui/components/infinite-scroll";

/**
 * Calls `onLoadMore` once a sentinel at the bottom of `children` scrolls
 * into view, via `IntersectionObserver`.
 */
const meta = {
  title: "forth-ui/InfiniteScroll",
  component: InfiniteScroll,
  args: {
    hasMore: true,
    onLoadMore: () => undefined,
    children: null,
  },
} satisfies Meta<typeof InfiniteScroll>;

export default meta;

type Story = StoryObj<typeof meta>;

function InfiniteScrollExample() {
  const [count, setCount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const maxItems = 60;

  function loadMore() {
    if (loading) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setCount((prev) => Math.min(prev + 20, maxItems));
      setLoading(false);
    }, 800);
  }

  return (
    <div className="h-80 w-72 overflow-y-auto rounded-lg border">
      <InfiniteScroll
        hasMore={count < maxItems}
        loading={loading}
        onLoadMore={loadMore}
      >
        <ul className="divide-y">
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className="p-3 text-sm">
              Item {i + 1}
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}

/**
 * Scroll to the bottom of the list to load more items (simulated with a
 * short delay).
 */
export const Default: Story = {
  render: () => <InfiniteScrollExample />,
};
