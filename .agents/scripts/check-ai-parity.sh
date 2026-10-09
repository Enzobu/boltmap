#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

fail=0

check_rule_mirror() {
  local canonical="$1"
  local mirror="$2"

  while IFS= read -r -d '' file; do
    local name
    name="$(basename "$file")"
    if [[ ! -f "$mirror/$name" ]]; then
      echo "Missing rule mirror: $mirror/$name"
      fail=1
    elif ! cmp -s "$file" "$mirror/$name"; then
      echo "Rule differs from canonical: $mirror/$name"
      fail=1
    fi
  done < <(find "$canonical" -maxdepth 1 -type f -name '*.md' -print0 | sort -z)

  while IFS= read -r -d '' file; do
    local name
    name="$(basename "$file")"
    if [[ ! -f "$canonical/$name" ]]; then
      echo "Extra rule without canonical source: $mirror/$name"
      fail=1
    fi
  done < <(find "$mirror" -maxdepth 1 -type f -name '*.md' -print0 | sort -z)
}

check_rule_mirror ".claude/rules" ".codex/rules"
check_rule_mirror ".claude/rules" ".agents/rules"

while IFS= read -r -d '' command; do
  name="$(basename "$command" .md)"
  [[ -f ".agents/skills/$name/SKILL.md" ]] || {
    echo "Missing skill for Claude command: $name"
    fail=1
  }
done < <(find .claude/commands -maxdepth 1 -type f -name '*.md' -print0 | sort -z)

while IFS= read -r -d '' skill; do
  name="$(basename "$(dirname "$skill")")"
  [[ -f ".claude/commands/$name.md" ]] || {
    echo "Missing Claude command for skill: $name"
    fail=1
  }
done < <(find .agents/skills -mindepth 2 -maxdepth 2 -type f -name 'SKILL.md' -print0 | sort -z)

while IFS= read -r -d '' agent; do
  name="$(basename "$agent" .md)"
  [[ -f ".codex/agents/$name.toml" ]] || {
    echo "Missing Codex agent for Claude agent: $name"
    fail=1
  }
done < <(find .claude/agents -maxdepth 1 -type f -name '*.md' -print0 | sort -z)

while IFS= read -r -d '' agent; do
  name="$(basename "$agent" .toml)"
  [[ -f ".claude/agents/$name.md" ]] || {
    echo "Missing Claude agent for Codex agent: $name"
    fail=1
  }
done < <(find .codex/agents -maxdepth 1 -type f -name '*.toml' -print0 | sort -z)

[[ -f CLAUDE.md ]] || { echo "Missing CLAUDE.md"; fail=1; }
[[ -f AGENTS.md ]] || { echo "Missing AGENTS.md"; fail=1; }

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "Agent configuration parity is valid."
