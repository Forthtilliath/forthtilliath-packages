import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { useScrollspy } from "@forthtilliath/forth-ui/components/scrollspy";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

const SECTIONS = ["introduction", "installation", "usage", "api"];
const LABELS: Record<string, string> = {
  introduction: "Introduction",
  installation: "Installation",
  usage: "Usage",
  api: "API",
};

function ScrollspyExample() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeId = useScrollspy({
    ids: SECTIONS,
    root: containerRef,
    rootMargin: "0px 0px -60% 0px",
  });

  return (
    <div className="flex gap-6">
      <nav className="sticky top-0 flex h-fit flex-col gap-1">
        {SECTIONS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              "rounded px-2 py-1 text-sm",
              activeId === id
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            {LABELS[id]}
          </a>
        ))}
      </nav>
      <div
        ref={containerRef}
        className="h-72 w-72 overflow-y-auto rounded-lg border"
      >
        {SECTIONS.map((id) => (
          <section key={id} id={id} className="border-b p-6 last:border-0">
            <h3 className="mb-2 text-sm font-semibold">{LABELS[id]}</h3>
            <p className="text-muted-foreground text-sm">
              Content for the {id} section.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}

/**
 * Tracks which of the given element `id`s is currently scrolled into
 * view, via `IntersectionObserver` — for highlighting the active link in
 * a table-of-contents/side nav.
 */
const meta = {
  title: "forth-ui/Navigation/Scrollspy",
  component: ScrollspyExample,
} satisfies Meta<typeof ScrollspyExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Scroll the box on the right — the matching link on the left highlights.
 */
export const Default: Story = {};
