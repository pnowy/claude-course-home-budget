Analyze all current changes in the repository and create a well-structured commit.

Follow these steps:
1. Run `git diff --staged` to see staged changes. If there are no staged changes, run `git diff` and `git status` to review unstaged changes, then stage the appropriate files.
2. Analyze the changes semantically — understand *what* was changed and *why*, not just which files were modified.
3. If the changes span multiple unrelated concerns, split them into separate logical commits (stage and commit each group independently).
4. Generate a commit message following the Conventional Commits format:
   - Use the appropriate type: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`
   - Add a scope in parentheses when the change is limited to a specific module or area, e.g. `feat(auth):`
   - Write a concise subject line (max 72 characters) in imperative mood
   - Add a body only if the *why* behind the change is not obvious from the subject line
5. Follow any additional commit conventions defined in CLAUDE.md.
6. Run `git commit` with the generated message. Do not use `--no-verify`.

$ARGUMENTS