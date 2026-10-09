# Project discovery rules

## Inspect before editing

- Read the closest `CLAUDE.md`, `AGENTS.md`, `README`, contribution guide and relevant architecture documentation.
- Inspect the files around the target before designing a change.
- Detect the package manager from lockfiles and existing commands; never introduce another package manager accidentally.
- Inspect available scripts, test configuration, linters, formatters, CI workflows, Docker files and environment templates.
- Detect the repository's default and protected branches instead of assuming `main`, `master` or `dev`.
- Search for an existing implementation, helper, component, type, endpoint or convention before creating a new one.

## Grounding

- Do not invent paths, commands, package names, API behavior, database fields or requirements.
- When evidence conflicts, prefer the most specific and current source: executable code and configuration, then project documentation, then generic rules.
- State assumptions that materially affect the implementation.
- If a requested command does not exist, use the closest verified project command or explain the limitation.

## Scope

- Identify affected apps, packages, services, public contracts, data stores and deployment environments.
- Distinguish the requested change from unrelated cleanup.
- Record potential breaking changes before implementation.
