# @forthtilliath/typescript-config

Shared `tsconfig.json` bases: `strict: true`, `noUncheckedIndexedAccess`,
ES2022 target, NodeNext module resolution — plus React, Next.js and Angular
presets on top.

## Install

```bash
npm install -D @forthtilliath/typescript-config
```

Within this monorepo:

```json
{
  "devDependencies": {
    "@forthtilliath/typescript-config": "workspace:*"
  }
}
```

Requires TypeScript 5.5+ (the presets use `${configDir}`, see below).

## Usage

```json
// A plain TypeScript library (packages/ts-kit, packages/eslint-config...)
{
  "extends": "@forthtilliath/typescript-config/base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

```json
// A React library or Vite app (packages/react/*, apps/react-sb)
{
  "extends": "@forthtilliath/typescript-config/react.json"
}
```

```json
// A Next.js app (apps/web) — nothing else needed
{
  "extends": "@forthtilliath/typescript-config/nextjs.json"
}
```

```json
// An Angular app/library
{
  "extends": "@forthtilliath/typescript-config/angular.json"
}
```

| Preset         | Extends      | Adds                                                                                                                                                                                                                                                               |
| -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `base.json`    | —            | `strict`, `noUncheckedIndexedAccess`, `isolatedModules`, ES2022, NodeNext, declarations                                                                                                                                                                            |
| `react.json`   | `base.json`  | `jsx: react-jsx`, bundler resolution                                                                                                                                                                                                                               |
| `nextjs.json`  | `react.json` | Everything `create-next-app` generates (`next` TS plugin, `allowJs`, `noEmit`, `incremental`, ESNext + DOM libs, `next-env.d.ts` / `.next/types` / `.next/dev/types` inclusion, `@/*` → `src/*` alias), plus `noImplicitOverride` and `noFallthroughCasesInSwitch` |
| `angular.json` | `base.json`  | Angular CLI's generated settings (see below)                                                                                                                                                                                                                       |

### Paths resolve against _your_ project

A path in a tsconfig resolves relative to the file that declares it — so an
`include` or a `paths` alias written in this package would point inside
`node_modules/@forthtilliath/typescript-config/`, and every consumer used to
have to redeclare them. The presets use `${configDir}` (TypeScript 5.5+)
instead, which resolves to the directory of the tsconfig that _extends_ the
preset: `include`, `exclude` and the `@/*` alias work as-is.

Redeclaring `include`/`exclude` in your own tsconfig replaces the preset's
list entirely (tsconfig doesn't merge arrays) — relist what you still need,
e.g. to exclude a service worker built separately:

```json
{
  "extends": "@forthtilliath/typescript-config/nextjs.json",
  "exclude": ["node_modules", "src/sw.ts"]
}
```

### Angular

`angular.json` mirrors the Angular CLI's own generated tsconfig:
`experimentalDecorators` (paired with `useDefineForClassFields: false`, the
combination that keeps decorated property initializers working, e.g.
`@Input()`), `"module": "preserve"` + `"moduleResolution": "bundler"` for the
esbuild-based build system (Angular 17+), a few extra strict flags
(`noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`) the CLI enables by
default — kept scoped to this preset rather than added to `base.json`, since
that would newly apply them to every existing package instead of just future
Angular ones — and `angularCompilerOptions.strictTemplates` (checked by
`ngc`, not `tsc`, but read from this same file), which is what actually
catches a typo'd property or wrong-typed binding in a `.html` template
instead of failing silently at runtime.

## Scripts

None — this package ships raw `.json` files, no build step.
