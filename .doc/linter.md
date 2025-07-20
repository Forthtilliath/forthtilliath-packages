https://www.youtube.com/watch?v=lEkXbneUnWg
https://www.ultracite.ai/examples
https://www.ultracite.ai/setup


Okay, je te balance un exemple de fichier `eslint.config.ts` optimisé pour un mono repo Turbo avec TypeScript et React. Ensuite, je te filerai une liste de libs qui te simplifient grave la vie côté config ESLint.

---

### Exemple `eslint.config.ts`

```ts  
import { Linter } from "eslint";

const config: Linter.Config = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react/prop-types": "off", // Si tu utilises TS, inutile  
    "react/react-in-jsx-scope": "off", // React 17+ ne nécessite plus l'import React explicite  
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // Règles spécifiques TS si besoin  
      },
    },
    {
      files: ["*.js", "*.jsx"],
      rules: {
        // Possibilité de désactiver ou adapter certaines règles JS  
      },
    },
  ],
};

export default config;
```

---

### Les librairies qui déchirent pour générer ou gérer les configs ESLint

1. **eslint-config-airbnb**  
   - Standard ultra populaire avec règles strictes, très utilisée dans le monde React/JS.  
   - Tu peux l’adapter en y ajoutant TS avec `eslint-config-airbnb-typescript`.

2. **eslint-config-prettier**  
   - Pour désactiver les règles ESLint qui pourraient entrer en conflit avec Prettier.  
   - Indispensable si tu utilises Prettier pour le formatage.

3. **eslint-config-standard**  
   - Une autre config très clean et simple, plus permissive que Airbnb.

4. **eslint-config-next**  
   - Si tu fais du Next.js, c’est un must.  
   - Elle optimise la config ESLint pour l’environnement Next.

5. **@typescript-eslint/eslint-plugin** et **@typescript-eslint/parser**  
   - Le duo TypeScript officiel pour ESLint, une base solide.

6. **eslint-plugin-react** et **eslint-plugin-react-hooks**  
   - Pour tout ce qui est React évidemment, avec règles spécifiques aux hooks.

7. **eslint-plugin-import**  
   - Gère et vérifie l’ordre des imports, évite les imports non résolus, etc.

---

Si tu veux, je peux aussi te faire un script d’installation simplifié de toutes ces dépendances avec leurs versions compatibles. Ça peut sauver du temps.

Alors, t’en penses quoi ? Je continue dans cette voie ou tu veux que je rentre dans les détails plus pointus ?