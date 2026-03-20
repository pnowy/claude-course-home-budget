Create a pull request for the current branch.

Follow these steps:
1. Run `git branch --show-current` to identify the current branch.
2. Run `git log main..HEAD --oneline` to review all commits on this branch.
3. Run `git diff main...HEAD --stat` to get an overview of changed files, then `git diff main...HEAD` for the full diff.
4. Generate a PR title following the Conventional Commits format (e.g. `feat(payments): add Stripe webhook handler`).
5. Generate the PR body with the following structure:

   ## Summary
   A clear, concise description of what this PR does and why. Focus on the problem being solved and the approach taken.

   ## Changes
   A bullet list of the key changes, grouped logically. Do not just list files — describe what each change accomplishes.

   ## Test plan
   Describe how the changes were tested or how reviewers can verify them.

6. Run `gh pr create --title "..." --body "..."` targeting the `main` branch.
   - If the user mentions "draft" in arguments, add the `--draft` flag.
   - If the user mentions an issue number (e.g. #123), include `Closes #123` in the summary section.

$ARGUMENTS