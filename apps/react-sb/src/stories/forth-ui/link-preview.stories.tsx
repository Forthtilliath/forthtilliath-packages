import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link, LinkPreview } from "@forthtilliath/forth-ui/components/link";

// A self-contained SVG data URI, so the story's preview image renders
// reliably without depending on a live third-party OG-image endpoint.
const PLACEHOLDER_OG_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#3f3f46" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#g)" />
      <text x="80" y="340" font-family="system-ui, sans-serif" font-size="96" font-weight="700" fill="#fafafa">Turborepo</text>
    </svg>
  `);

/**
 * Reveals a metadata card (title/description/image) on hover over its
 * trigger — the "unfurl" pattern used for link previews. Metadata is
 * supplied by the caller, not fetched live (see the component's JSDoc).
 */
const meta = {
  title: "forth-ui/Navigation/LinkPreview",
  component: LinkPreview,
  args: {
    metadata: {
      title: "Turborepo",
      description:
        "Turborepo is a high-performance build system for JavaScript and TypeScript codebases.",
      image: PLACEHOLDER_OG_IMAGE,
      url: "turborepo.com",
    },
    children: <Link href="https://turborepo.com">Turborepo</Link>,
  },
} satisfies Meta<typeof LinkPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Hover the link to reveal the preview card.
 */
export const Default: Story = {};
