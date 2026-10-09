# Git rules

## General

- Never commit, push, close an issue, merge or rewrite history without explicit user intent.
- Always inspect `git status`, relevant diffs and recent commit style before preparing commits.
- Keep commits small, coherent and independently understandable.
- Stage files explicitly; do not use a blind catch-all when unrelated changes are present.

## Branches

- Detect the default and protected branches; do not assume a specific branch model.
- Do not commit directly to a protected branch when the project expects pull requests.
- Follow existing branch naming. Otherwise use kebab-case with `feat/`, `fix/`, `refactor/`, `docs/`, `ci/` or `chore/`.

## Commit messages

- Use the repository's commit convention. If none exists, use Conventional Commits:
  - `<type>: <subject>`
  - `<type>(<scope>): <subject>`
- Prefer: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `style`.
- Use English unless the repository clearly uses another language.
- Describe the reason in the body when the subject cannot explain the motivation.
- Reference the related issue when one exists.
- Do not add AI attribution or `Co-authored-by` lines unless explicitly requested.

## Commit content

- Do not mix unrelated features, fixes and refactors.
- Do not commit secrets, real `.env` files, private keys, database dumps, generated build output or temporary artifacts.
- Change lockfiles only when dependencies were intentionally changed.
- Never bypass hooks with `--no-verify`; fix the cause or explain the blocker.

## Pull requests

- PR titles should follow the repository's commit convention.
- PR descriptions should explain context, changes, testing, risks and linked issues.
- Mention breaking changes, migrations and deployment impact clearly.
- Prefer a draft PR to an unreviewed or knowingly incomplete final PR.

## Safety

- Ask before destructive commands or history rewriting.
- Never run `git reset --hard`, `git clean -fd`, force push or interactive rebase without explicit approval and a clear impact summary.
- Never force push a protected branch.
