import type { Preview } from "@storybook/react-vite";

// To be able to use all classes inside stories className inputs
import "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

import { decoratorHtml, decoratorStory } from "./decorators";

import "@forthtilliath/shadcn-ui/globals-static.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // To not have conflicts with decorators which setup the theme
    backgrounds: { disable: true },
  },
  tags: ["autodocs"],
  // decorators: [ModeDecorator],
  decorators: [decoratorHtml, decoratorStory],
};

export default preview;
