Create a new feature branch and switch to it.

Follow these steps:
1. Take the feature name from the arguments: $ARGUMENTS
2. Convert the feature name to a valid branch name — lowercase, replace spaces with hyphens, remove special characters.
3. Create and switch to the branch using: `git checkout -b feat/<branch-name>`
4. Confirm the branch was created by running `git branch --show-current`.