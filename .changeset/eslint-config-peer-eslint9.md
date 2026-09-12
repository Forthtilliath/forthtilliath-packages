---
"@forthtilliath/eslint-config": patch
---

Pin `@eslint/js` to the 9.x line instead of `^10.0.1`. `@eslint/js@10` declares a hard `peerDependencies.eslint: "^10.0.0"`, which silently forced every consumer onto ESLint 10 even though this package's own peer range (`eslint: ">=9.0.0"`) says ESLint 9 is supported — surfaced as an ERESOLVE conflict the moment a consumer still on ESLint 9 installed this package.
