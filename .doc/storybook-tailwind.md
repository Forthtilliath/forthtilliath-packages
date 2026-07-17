# Storybook + Tailwind + thèmes

Setup réel dans `apps/react-sb/.storybook/` (à ne pas confondre avec des
essais antérieurs — ce fichier documente ce qui tourne aujourd'hui).

## CSS : build séparé, pas de plugin Vite Tailwind

Storybook sert un CSS **précompilé**, pas du Tailwind live via un plugin
Vite. `apps/react-sb/src/styles/globals.css` (source) importe
`@forthtilliath/forth-ui/styles/globals.css`, qui lui-même importe
`@forthtilliath/shadcn-ui/styles/globals-static.css` +
`themes/twitter.css`. Le script `build:tw` (Tailwind CLI) compile ça vers
`.storybook/globals.css`, chargé en `<link>` par
[`preview-body.html`](../apps/react-sb/.storybook/preview-body.html) :

```bash
pnpm run build:tw:once   # one-shot
pnpm run dev:tw          # watch, à lancer en parallèle de `storybook dev`
```

Piège de nommage existant : `build:tw` a déjà `--watch` intégré, et
`dev:tw` fait `pnpm run build:tw --watch` — donc un double `--watch`
redondant (inoffensif mais trompeur). `prebuild-storybook` lance
`build:tw:once` (le vrai one-shot) automatiquement avant
`storybook build`.

## Thème clair/sombre : `@storybook/addon-themes`

[`decorators.ts`](../apps/react-sb/.storybook/decorators.ts) bascule la
classe `dark` sur `<html>` via `withThemeByClassName` — un seul axe
possible avec cet addon (son global `theme` est déjà pris).

```ts
export const twDecoratorHtml = withThemeByClassName<ReactRenderer>({
  themes: { light: "", dark: "dark" },
  defaultTheme: "light",
});
```

## Thème de couleur (palette) : décorateur custom, pas addon-themes

Pour un second sélecteur indépendant (palette tweakcn : blue, violet,
bubblegum, ...), `addon-themes` ne suffit pas — il ne gère qu'un seul axe.
[`color-themes.ts`](../apps/react-sb/.storybook/color-themes.ts) importe
le CSS brut de chaque fichier de thème via `import.meta.glob(..., {
query: "?raw" })` (fonctionnalité Vite), et un décorateur injecte le texte
du thème sélectionné dans un `<style>` non-layé au clic sur le toolbar.

Point piégeux réglé : `globals.css` compilé déclare déjà `--background`,
`--primary`, etc. en `:root`/`.dark` non-layés lui aussi (et même en
double — `globals-static.css` importe `themes/default.css`
inconditionnellement, puis `twitter.css` gagne par ordre de source). Se
reposer sur "mon `<style>` est ajouté après, donc il gagne" est trop
fragile (dépend de détails de service du dev server Vite). La solution
robuste : forcer `!important` sur chaque déclaration `--var: ...;`
injectée (`forceImportant()` dans `color-themes.ts`) — ça gagne quel que
soit le layer/la spécificité/l'ordre.

`preview.ts` déclare `colorTheme` comme global Storybook séparé
(`globalTypes` + `initialGlobals`), indépendant du `theme` d'addon-themes.
