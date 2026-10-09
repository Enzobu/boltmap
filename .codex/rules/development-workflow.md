# Development workflow rules

## Default lifecycle

For substantial work, follow this order:

1. Understand the request and identify the source of truth.
2. Define observable acceptance criteria.
3. Inspect the affected architecture and existing patterns.
4. Create or link an issue when the repository uses issue tracking.
5. Detect the base branch and create a focused working branch when requested or when the workflow calls for it.
6. Decompose cross-cutting work into ordered tasks.
7. Implement the smallest vertical slice that proves the approach.
8. Add or update tests at the appropriate level.
9. Update contracts, documentation, examples and environment templates where applicable.
10. Run focused checks first, then broader checks for shared or public behavior.
11. Review the diff against the acceptance criteria and Definition of Done.
12. Commit, push, open a PR and close the issue only when explicitly requested.

## Issue-first, not issue-blocked

- Prefer an issue for non-trivial features, bugs and refactors when the repository uses GitHub Issues or another tracker.
- An issue must contain context, scope, testable acceptance criteria and applicable delivery checks.
- Do not block a small or explicitly direct task solely because no tracker is configured. Maintain an internal checklist instead and mention that no issue was used.

## Branching

- Detect the repository's base branch from remote metadata, contribution documentation or existing PR conventions.
- Never assume a Git Flow model.
- Do not work directly on a protected branch when the repository expects pull requests.
- Keep branches focused and use the project's naming style; otherwise prefer `feat/`, `fix/`, `refactor/`, `docs/`, `ci/` or `chore/` with kebab-case.

## Multi-area work

- Update shared contracts before consumers when a public shape changes.
- Keep each layer or app independently buildable where possible.
- Verify integration points after specialist work is consolidated.
- Use the orchestrator for changes spanning multiple apps, packages or technical domains.

## Stop conditions

Stop and report clearly when:

- a destructive or irreversible action requires permission;
- requirements conflict and proceeding would create a materially different product;
- required credentials or external systems are unavailable;
- the only apparent solution weakens security, tests or quality gates;
- verification reveals a broader issue outside the requested scope.
