# @forthtilliath/typescript-config

Shared `tsconfig.json` bases for every package/app in this monorepo:
`strict: true`, `noUncheckedIndexedAccess`, ES2022 target, NodeNext module
resolution.

## Install

```json
{
  "devDependencies": {
    "@forthtilliath/typescript-config": "workspace:*"
  }
}
```

## Usage

```json
// A plain TypeScript library (packages/lib, packages/types, packages/eslint-config)
{
  "extends": "@forthtilliath/typescript-config/base.json"
}
```

```json
// A React library or Vite app (packages/react/*, apps/react-sb)
{
  "extends": "@forthtilliath/typescript-config/react.json"
}
```

```json
// A Next.js app (apps/web)
{
  "extends": "@forthtilliath/typescript-config/nextjs.json"
}
```

Each builds on the previous one: `react.json` extends `base.json` (adds JSX,
bundler module resolution), `nextjs.json` extends `react.json` (adds the
`next` TS plugin, `.next/types` inclusion, and the `@/*` path alias).

Packages typically add their own `compilerOptions` on top for `outDir`/
`rootDir`, and their own `include`/`exclude` — this package only supplies the
shared defaults, not a full ready-to-use config.

## Scripts

None — this package ships raw `.json` files, no build step.
