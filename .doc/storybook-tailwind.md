# Storybook With Tailwind

## Configuration

This decorator adds a `dark` class to the HTML tag when the theme is set to `dark`, allowing Tailwind CSS to detect and apply dark mode styling.

```ts
// .storybook/decorators.ts
import { withThemeByClassName } from "@storybook/addon-themes";
import { ReactRenderer } from "@storybook/react-vite";

export const decoratorHtml = withThemeByClassName<ReactRenderer>({
  themes: {
    light: "",
    dark: "dark",
  },
  defaultTheme: "light",
  parentSelector: "html",
});
```

```ts
// preview.ts
import type { Preview } from "@storybook/react-vite";

// To be able to use all classes inside stories className inputs
import "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

import { decoratorHtml, decoratorStory } from "./decorators";

// Add a background for the preview's box
import "@forthtilliath/shadcn-ui/globals-static.css";
// Include global styles
import "@forthtilliath/forth-ui/styles/globals.css";

const preview: Preview = {
  parameters: {
    // To not have conflicts with decorators which setup the theme
    backgrounds: { disable: true },
  },
  // Add decorators
  decorators: [decoratorHtml, decoratorStory],
};

export default preview;
```

```css
/* @forthtilliath/shadcn-ui/globals-static.css */
@import "tailwindcss";

/* static makes variables accessible inside storybook */
@theme static {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

@layer base {
  /* Storybook Preview Container */
  .docs-story {
    @apply bg-background;
  }
}
```
