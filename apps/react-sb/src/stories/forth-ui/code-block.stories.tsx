import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock } from "@forthtilliath/forth-ui/components/code-block";

const SAMPLE_TS = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("world"));`;

/**
 * A syntax-highlighted code block (via Shiki), with a copy-to-clipboard
 * button, an optional filename/language header, and optional line numbers.
 */
const meta = {
  title: "forth-ui/CodeBlock",
  component: CodeBlock,
  args: {
    code: SAMPLE_TS,
    language: "typescript",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form, with a language badge in the header.
 */
export const Default: Story = {};

/**
 * Use the `filename` prop to show it in the header, before the language
 * badge.
 */
export const WithFilename: Story = {
  args: {
    filename: "greet.ts",
  },
};

/**
 * Use `showLineNumbers` to number each line.
 */
export const LineNumbers: Story = {
  args: {
    filename: "greet.ts",
    showLineNumbers: true,
  },
};

/**
 * Plain text, no syntax highlighting — the `language` prop defaults to
 * `"text"` when omitted.
 */
export const PlainText: Story = {
  args: {
    code: "No highlighting here, just monospace text.",
    language: "text",
  },
};
