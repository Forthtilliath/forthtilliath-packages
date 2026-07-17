import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link, LinkPreview } from "@forthtilliath/forth-ui/components/link";

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
      image: "https://turborepo.com/api/og",
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
