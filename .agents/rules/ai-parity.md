# Agent configuration parity

This repository supports Claude Code, Codex and OpenCode with semantically equivalent guidance.

## Mapping

| Concept | Claude Code | Codex | OpenCode / shared |
|---|---|---|---|
| Root context | `CLAUDE.md` | `AGENTS.md` | `AGENTS.md` |
| Thematic rules | `.claude/rules/*.md` | `.codex/rules/*.md` | `.agents/rules/*.md` |
| Specialist agents | `.claude/agents/*.md` | `.codex/agents/*.toml` | project-dependent |
| User workflows | `.claude/commands/*.md` | `.agents/skills/*/SKILL.md` | `.agents/skills/*/SKILL.md` when supported |
| Project config | `.claude/settings.json` | `.codex/config.toml` | `opencode.json` |

## Required parity

- A rule change must be copied to all three rule directories in the same change.
- A Claude command must have a semantically equivalent skill with the same name.
- A Claude specialist agent must have a Codex TOML equivalent.
- Root instructions must remain semantically aligned even when syntax differs.
- Project-specific additions should be mirrored only where the target tool supports them.

## Verification

Run `.agents/scripts/check-ai-parity.sh` before committing changes to agent configuration.
