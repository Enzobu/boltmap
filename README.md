# Agent Rules

Reusable development rules and workflows for Claude Code, Codex and OpenCode.

The package combines:

- broad engineering rules that adapt to the stack already present in a repository;
- issue-first delivery for substantial work;
- dedicated workflows for features, fixes, refactors, commits and ticket closure;
- specialist agents for backend, frontend, DevOps, IoT, testing and specification review;
- semantic parity between Claude Code, Codex and OpenCode.

## Install

Copy the contents of this directory to the root of a project. Review the project-scoped settings before committing them:

- `.claude/settings.json`
- `.codex/config.toml`
- `opencode.json`

The rules intentionally avoid imposing a framework, branch model, package manager or documentation tool. Agents must discover and follow the conventions already present in the target repository.

## Main workflows

| Goal | Claude Code | Codex / compatible skills |
|---|---|---|
| Load all rules | `/rules` | `$rules` |
| Create an issue | `/create-ticket` | `$create-ticket` |
| Deliver a feature | `/feature` | `$feature` |
| Fix a bug test-first | `/fix` | `$fix` |
| Refactor safely | `/refactor` or `/refacto` | `$refactor` or `$refacto` |
| Review current changes | `/review` | `$review` |
| Check a specification / CDC | `/check-spec` or `/check-cdc` | `$check-spec` or `$check-cdc` |
| Commit and push | `/commit` | `$commit` |
| Verify and close an issue | `/close-ticket` | `$close-ticket` |

## Sources of truth

- Claude rules: `.claude/rules/`
- Codex rule mirror: `.codex/rules/`
- OpenCode/shared mirror: `.agents/rules/`
- Claude commands: `.claude/commands/`
- Codex/shared skills: `.agents/skills/`
- Claude subagents: `.claude/agents/`
- Codex subagents: `.codex/agents/`

Run `.agents/scripts/check-ai-parity.sh` after changing the configuration.

## Customization

Project-specific constraints belong in the closest `CLAUDE.md` and `AGENTS.md`, for example inside an app or package. More specific instructions override root-level generic rules.
