// Enforces the Conventional Commits format required for every commit in
// this monorepo (see CLAUDE.md's global commit rules): `<type>: <description>`,
// lowercase after the prefix, under 70 characters. Wired as the `commit-msg`
// hook in lefthook.yml, after strip-claude-attribution (which must run
// first — see that hook's `piped: true`), so a malformed message is
// rejected instead of relying on manual vigilance.
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "chore",
        "refactor",
        "test",
        "style",
        "perf",
        "build",
        "ci",
      ],
    ],
    // "<70 characters" per the repo's own commit rule, i.e. 69 max.
    "header-max-length": [2, "always", 69],
  },
};
