# @forthtilliath/forth-ui

Higher-level, opinionated React components built on top of
[`@forthtilliath/shadcn-ui`](../shadcn-ui) primitives. Where shadcn-ui gives
you the building blocks (`Button`, `Popover`, `Command`, ...), forth-ui
assembles them into complete, batteries-included patterns — a `Combobox`
built from `Popover` + `Command`, a `PasswordInput` with a strength meter, a
`Dropdrawer` that's a `DropdownMenu` on desktop and a `Drawer` on mobile —
so you don't have to wire the same recipe from scratch in every project.

58 components across 8 categories, styled with Tailwind CSS and
`class-variance-authority`, fully typed, and browsable in Storybook
(`pnpm run dev:sb` from the repo root).

## Table of contents

- [Why forth-ui](#why-forth-ui)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Conventions](#conventions)
- [Theming](#theming)
- [Development](#development)
- [License](#license)

## Why forth-ui

- **Complete patterns, not just primitives.** Every component solves a
  whole problem — form field wiring (`Field`), file upload with previews
  (`Dropzone`, `ImageInput`), an imperative confirm dialog
  (`useConfirm`) — instead of leaving the composition to each consumer.
- **Consistent variants.** Every component that has visual variants uses
  the same `class-variance-authority` shape (`variant`, `size`, `look`,
  `shape`, ...), so once you've learned one component's API, the others
  feel familiar.
- **One folder, one subpath import.** No barrel file dragging in the whole
  library — `import { Combobox } from "@forthtilliath/forth-ui/components/combobox"`
  pulls in exactly that component's code.
- **Distributable like shadcn.** Every component (but `Grid`, see
  [Registry](#registry)) is also published as a
  [shadcn-compatible registry item](../../../apps/shadweb/registry/forth-ui),
  so it can be vendored source-first into a consuming project instead of
  installed as an opaque `node_modules` dependency.

## Installation

### Via npm

```bash
npm install @forthtilliath/forth-ui @forthtilliath/shadcn-ui
```

Import the compiled stylesheet once, alongside your component imports:

```ts
import "@forthtilliath/forth-ui/styles/globals.css";
```

### As a workspace package (this monorepo)

Within this monorepo, `forth-ui` is consumed the same way, just via the
pnpm workspace protocol instead of a published version range:

```json
{
  "dependencies": {
    "@forthtilliath/forth-ui": "workspace:*"
  }
}
```

Components are built to `dist/` (`./components/*` →
`./dist/components/*/index.js`), so run `pnpm run build` (or `dev`) in
this package after source changes for consumers to pick them up.

### Via the shadcn registry

Every component also ships as a
[shadcn registry item](https://ui.shadcn.com/docs/registry) — the source
files land directly in _your_ project (`components/forth-ui/<name>/`),
import-rewritten to your own `components.json` aliases, exactly like
`npx shadcn add button` does for the official shadcn/ui components:

```bash
npx shadcn add <registry-url>/combobox.json
```

Add `forth-ui` as a named registry in your `components.json` to use the
short form instead:

```json
{
  "registries": {
    "@forth-ui": "<registry-url>/{name}.json"
  }
}
```

```bash
npx shadcn add @forth-ui/combobox
```

Cross-component dependencies (e.g. `Combobox` depending on another
forth-ui component) and shadcn primitives (e.g. `Popover`) are declared as
`registryDependencies` and resolve automatically — `shadcn add` cascades
and installs everything the component needs. See
[apps/shadweb](../../../apps/shadweb) for how the registry itself is built.

## Usage

```tsx
import { Field } from "@forthtilliath/forth-ui/components/field";
import { Combobox } from "@forthtilliath/forth-ui/components/combobox";

function Example() {
  return (
    <Field label="Framework" description="Pick the one you use most.">
      <Combobox
        options={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
        ]}
        placeholder="Select a framework..."
      />
    </Field>
  );
}
```

## Components

Grouped the same way as the Storybook sidebar (`forth-ui/<Category>/...`).

### Layout

| Component           | Import                       | Description                                                                   |
| ------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `Accordion`         | `components/accordion`       | A vertically stacked set of interactive headings that each reveal a section.  |
| `BentoGrid`         | `components/bento-grid`      | A CSS-grid layout for unevenly-sized cards ("bento box" layouts).             |
| `Collapsible`       | `components/collapsible`     | An interactive component which expands/collapses a single panel.              |
| `Grid`, `Grid.Item` | `components/grid`            | CSS-grid layout helpers with a built-in debug overlay.                        |
| `InfiniteScroll`    | `components/infinite-scroll` | Calls `onLoadMore` once a sentinel scrolls into view.                         |
| `Marquee`           | `components/marquee`         | Infinitely scrolls its children (a logo wall, a ticker).                      |
| `Reparent`          | `components/reparent`        | Moves children between different container elements at different breakpoints. |
| `Repeat`            | `components/repeat`          | Repeats a component a specified number of times.                              |
| `ScrollShadow`      | `components/scroll-shadow`   | A vertically-scrollable container with fade-out edge shadows.                 |
| `Separator`         | `components/separator`       | Visually or semantically separates content.                                   |
| `Spacer`            | `components/spacer`          | Adds space between components — a flexible filler or a fixed gap.             |
| `Stepper`           | `components/stepper`         | A numbered sequence of steps for a multi-stage flow.                          |

### Navigation

| Component                    | Import                  | Description                                                               |
| ---------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `Breadcrumb`                 | `components/breadcrumb` | Displays the path to the current resource using a hierarchy of links.     |
| `Link`, `LinkPreview`        | `components/link`       | A styled hyperlink, plus a hover-triggered metadata preview card.         |
| `Navbar`                     | `components/navbar`     | A fixed, floating page header that shrinks on scroll, plus a mobile menu. |
| `Pagination`                 | `components/pagination` | Navigates between pages, computing visible page numbers and ellipses.     |
| `Scrollspy` (`useScrollspy`) | `components/scrollspy`  | Tracks which element id is currently scrolled into view.                  |

### Buttons & Actions

| Component               | Import              | Description                                                                    |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------ |
| `Button`, `ButtonGroup` | `components/button` | A button, or a component that looks like one, plus joined button rows/columns. |
| `Chip`                  | `components/chip`   | A compact, interactive element for status, categories, or filters.             |

### Forms

| Component                 | Import                      | Description                                                              |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `CheckboxGroup`           | `components/checkbox`       | A group of checkboxes sharing a single array value.                      |
| `ColorPicker`             | `components/color-picker`   | A color swatch + hex input, synced with the native color picker.         |
| `Combobox`, `MultiSelect` | `components/combobox`       | An autocomplete/searchable select, and its multi-value variant.          |
| `DatePicker`              | `components/date-picker`    | A single-date picker built on a `Popover` + `Calendar` recipe.           |
| `Dropzone`                | `components/dropzone`       | A drag-and-drop file upload zone, listing accepted files below.          |
| `Field`                   | `components/field`          | Wires a label, description and error message to a single form control.   |
| `ImageInput`              | `components/image-input`    | A click-to-upload image picker with a live preview.                      |
| `NumberInput`             | `components/number-input`   | A numeric input with increment/decrement stepper buttons.                |
| `PasswordInput`           | `components/password-input` | A password `Input` with a show/hide toggle, plus a strength meter.       |
| `RadioCard`               | `components/radio`          | A card-style `RadioGroup` item — the whole card is the clickable target. |
| `Rating`                  | `components/rating`         | A star rating control with keyboard navigation and hover preview.        |
| `SubmitButton`            | `components/submit-button`  | A submit `Button` that shows its own loading state via `useFormStatus`.  |
| `TagsInput`               | `components/tags-input`     | A flexible input for adding/removing multiple tags.                      |

### Feedback

| Component            | Import                           | Description                                                             |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `Alert`              | `components/alert`               | Displays a callout for user attention.                                  |
| `Badge`              | `components/badge`               | Displays a badge or a component that looks like a badge.                |
| `Banner`             | `components/banner`              | A full-width, page-level announcement bar.                              |
| `CountAnimation`     | `components/count-animation`     | Animates a number counting up (or down) to a value whenever it changes. |
| `MultiStepLoader`    | `components/multi-step-loader`   | A full-screen overlay stepping through loading messages.                |
| `NotificationCenter` | `components/notification-center` | A bell-icon trigger with an unread badge, opening a notification list.  |
| `Progress`           | `components/progress`            | Displays an indicator showing the completion progress of a task.        |
| `ScrollProgress`     | `components/scroll-progress`     | A fixed bar tracking scroll percentage of the page or a container.      |
| `Spinner`            | `components/spinner`             | An accessible loading indicator, in one of a few visual styles.         |

### Overlays

| Component        | Import                       | Description                                                                         |
| ---------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `CommandPalette` | `components/command-palette` | A global command menu (Cmd/Ctrl+K to open).                                         |
| `useConfirm`     | `components/confirm-dialog`  | An imperative `await confirm({...})` alternative to hand-wiring an `AlertDialog`.   |
| `Dropdrawer`     | `components/dropdrawer`      | A menu that renders as a `DropdownMenu` on desktop and a bottom `Drawer` on mobile. |

### Data Display

| Component               | Import                        | Description                                                              |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `Avatar`, `AvatarGroup` | `components/avatar`           | An image with a fallback, status/badge indicators, and stacked grouping. |
| `DescriptionList`       | `components/description-list` | A description list, with terms and descriptions.                         |
| `FileList`              | `components/file-list`        | Displays a list of files with name, size, and upload progress.           |
| `Kbd`                   | `components/kbd`              | Displays which key or combination of keys performs a given action.       |
| `QrCode`                | `components/qr-code`          | Generates a QR code from a string, rendered as inline SVG.               |
| `RelativeTime`          | `components/relative-time`    | Displays a live-updating time, defaulting to the local timezone.         |
| `Sortable`              | `components/sortable`         | A drag-to-reorder list built on native HTML5 drag events.                |
| `Timeline`              | `components/timeline`         | A vertical sequence of dated events, connected by a line.                |
| `Tree`                  | `components/tree`             | A hierarchical, expandable/collapsible list of nodes.                    |

### Code & Content

| Component   | Import                  | Description                                                      |
| ----------- | ----------------------- | ---------------------------------------------------------------- |
| `CodeBlock` | `components/code-block` | A syntax-highlighted code block with a copy-to-clipboard button. |
| `Snippet`   | `components/snippet`    | Displays and copies code in a tabbed interface.                  |

## Conventions

- **One folder per component**, matching the `exports: "./components/*"`
  map — folders that export more than one related component (`Avatar` +
  `AvatarGroup`, `Combobox` + `MultiSelect`, `Button` + `ButtonGroup`,
  `Link` + `LinkPreview`) still ship as a single import path.
- **Variants via `class-variance-authority`.** Components with visual
  variants keep them in a co-located `variants.ts`, exporting both the
  `cva()` call and its `VariantProps` type (e.g. `BadgeVariants`).
- **Multi-part `className`.** Components with more than one internal
  element accept `className` as an object instead of a string, keyed by
  part (`{ root?, trigger?, content?, ... }`), so you can target exactly
  the part you need without fighting specificity.
- **`fallback`/`children`-first fallbacks**, not silent empty states —
  e.g. `Avatar`'s `fallback` prop is required, not optional.

## Theming

forth-ui has no styles of its own beyond Tailwind utility classes and the
CSS variables (`--primary`, `--muted`, `--border`, ...) already defined by
[`@forthtilliath/shadcn-ui`](../shadcn-ui)'s theme. Theming forth-ui means
theming shadcn-ui — swap the CSS variables (or the whole theme preset) and
every forth-ui component follows.

## Development

```bash
pnpm run dev            # concurrently: tsc --watch + tailwind --watch
pnpm run build          # tsc + tailwind build -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
```

Every component has a matching Storybook story under
[`apps/react-sb/src/stories/forth-ui`](../../../apps/react-sb/src/stories/forth-ui) —
run `pnpm run dev:sb` from the repo root to browse them all, organized into
the same 8 categories as this README.

### Registry

[`apps/shadweb/scripts/generate-forth-ui-registry.ts`](../../../apps/shadweb/scripts/generate-forth-ui-registry.ts)
regenerates the registry from this package's source — never hand-edit
`apps/shadweb/registry/forth-ui/**` directly. From `apps/shadweb`:

```bash
pnpm run registry:generate  # source -> apps/shadweb/registry/forth-ui + registry.json
pnpm run registry:build     # registry.json -> public/r/*.json (shadcn build)
pnpm run registry:sync      # both, in order
```

`Grid` is intentionally excluded — it depends on two private, unpublished
monorepo packages (`@forthtilliath/react-hooks`, `@forthtilliath/types`)
that aren't inlined into the registry item yet.

## License

MIT
