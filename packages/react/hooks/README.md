# @forthtilliath/react-hooks

Small standalone React hooks, published to npm.

## Install

```bash
npm install @forthtilliath/react-hooks
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "dependencies": {
    "@forthtilliath/react-hooks": "workspace:*"
  }
}
```

## Usage

Each hook is its own module — import the file you need directly:

```ts
import {
  SPECIAL_KEYS,
  useKeyListener,
} from "@forthtilliath/react-hooks/useKeyListener";
import { useToggleState } from "@forthtilliath/react-hooks/useToggleState";
```

### `useKeyListener(config, onKeyDown)`

Attaches a `window` `keydown` listener and calls `onKeyDown` when the event
matches every modifier specified in `config` (`key`, `ctrl`, `shift`, `alt`,
`meta` — all optional, unset ones are ignored). Also exports a
`SPECIAL_KEYS` constant (`ENTER`, `SPACE`, `ESCAPE`, `BACKSPACE`, `TAB`) for
the `key` field:

```ts
useKeyListener({ key: SPECIAL_KEYS.ESCAPE }, () => setOpen(false));
useKeyListener({ key: "s", ctrl: true }, save);
```

### `useToggleState(defaultValue?)`

Like `useState` for a boolean, plus a ready-made toggler:

```ts
const [isOpen, setIsOpen, toggleOpen] = useToggleState(false);
```

Returns `[value, setValue, toggle] as const`.

## Scripts

```bash
pnpm run dev            # tsc --watch -> dist/
pnpm run build          # tsc -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
pnpm run test           # vitest run
pnpm run test:watch     # vitest
```

Hooks are built to `dist/` (see the `exports` field in `package.json`), so
run `pnpm run build` (or `dev`) after source changes for consumers to see
them.
