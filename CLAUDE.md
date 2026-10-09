# Project agent instructions

This repository uses shared engineering rules and development workflows.

## Before changing code

1. Read the closest project instruction file (`CLAUDE.md` or `AGENTS.md`) from the repository root down to the files being changed.
2. Read the relevant files in `.claude/rules/`. For broad or multi-area work, load all rules.
3. Inspect the repository before proposing a solution: architecture, package manager, scripts, tests, CI, branch conventions and existing patterns.
4. Treat the current code and project documentation as evidence. Do not invent files, commands, APIs or conventions.

## Default behavior

- Keep changes focused and use the smallest clean solution.
- Preserve architecture and public contracts unless the task explicitly changes them.
- Reuse existing components, services, helpers, types and tooling before adding new ones.
- For non-trivial work, define acceptance criteria and a short ordered plan before implementation.
- Add or update meaningful tests when behavior changes.
- Update applicable documentation, API contracts, examples and environment templates in the same change.
- Never hardcode secrets or weaken security, tests, linting, quality gates or hooks to make a task pass.
- Never claim a check passed unless it was actually executed.
- Summarize changed files, commands run, results, remaining risks and anything not verified.

## Safety

- Do not commit, push, close issues, deploy, rewrite history or run destructive commands unless the user explicitly invokes the corresponding workflow or asks for that action.
- Before destructive actions, explain the impact and obtain explicit confirmation.
- Never expose credentials, tokens, private keys, production data or sensitive payloads.

## Workflow selection

- New capability: use the `feature` workflow.
- Bug: use the test-first `fix` workflow.
- Behavior-preserving cleanup: use the `refactor` workflow.
- Specification audit: use `check-spec` and the `spec-reviewer` agent.
- Cross-cutting change: use the `orchestrator` agent.
- Before delivery: use `review`, then `commit`, then `close-ticket` when applicable.

## Rule precedence

The closest project-specific instruction wins over a broader rule. A user instruction wins over repository defaults unless it would be unsafe or destructive.
