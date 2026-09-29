---
"@forthtilliath/ts-types": minor
---

Remove `helpers` (`StoryComponent`, `StoryDecorator`, `StoryArgumentsWithKey`) from the root barrel: they depend on React's types, which broke `import … from "@forthtilliath/ts-types"` in a React-free project (Angular, Node) with `skipLibCheck: false`. Import them from `@forthtilliath/ts-types/helpers` instead. `@types/react` is now declared as an optional peer dependency.
