---
name: commit
description: Verify, create logical Conventional Commits and push the current branch safely.
---


Commit and push the current work. Optional input: $ARGUMENTS

Invoking this command is explicit authorization to create commits and push the current non-protected branch, but not to merge, force push or rewrite history.

## Blocking checks

1. Inspect current branch, default/protected branches and remote state. Stop on a protected branch unless the repository explicitly allows direct commits.
2. Inspect `git status`, full diffs and recent commit style.
3. Check for secrets, real environment files, generated artifacts, debug code and unrelated changes.
4. Run the smallest applicable lint, type-check, test and build commands, then broader checks required by shared impact.
5. Never use `--no-verify`; if a hook fails, fix or report the cause.

## Commit workflow

1. Group changes into logical commits. Do not mix unrelated concerns.
2. Stage explicit files for each commit.
3. Use the repository convention; otherwise use Conventional Commits.
4. Reference the issue when one exists.
5. Do not add AI attribution or co-author lines unless requested.
6. Create each commit and inspect `git status` after it.
7. Push with upstream tracking on first push.
8. Never force push without separate explicit permission.
9. When useful, propose a PR using `.agents/templates/pull-request.md`; do not merge it automatically.

## Final report

- Branch and remote pushed.
- Commit hashes and subjects.
- Verification commands and results.
- Remaining uncommitted files.
- PR URL when one was explicitly created.
