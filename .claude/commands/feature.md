---
description: Deliver a feature end-to-end with acceptance criteria, architecture, tests, contracts, documentation and verification.
argument-hint: <issue number | feature description>
---

Implement the feature described by: $ARGUMENTS

## Preparation

1. Load all rules and inspect the repository using `project-discovery.md`.
2. If an issue number is provided, read it and treat its accepted criteria as the source of truth.
3. If no issue exists, use issue-first delivery for substantial work when the repository has a tracker; otherwise create a clear internal checklist and continue.
4. Detect the base branch and existing branch convention. Do not assume `dev` or `main`.
5. Create a focused feature branch only when branch creation is part of the requested workflow and the current branch is unsuitable.
6. Identify affected apps, packages, contracts, data, environments and documentation.
7. For multi-area work, delegate planning and consolidation to `orchestrator`.

## Implementation order

1. Define or confirm observable acceptance criteria.
2. Update shared contracts or schemas before their consumers when required.
3. Implement business/domain behavior.
4. Implement persistence and integrations.
5. Implement API/interface and frontend behavior.
6. Add unit tests for business rules, integration tests for real boundaries and end-to-end tests for critical journeys where applicable.
7. Update API docs, collections, feature docs, README, ADRs, runbooks and `.env.example` only where relevant.
8. Verify each acceptance criterion explicitly.
9. Run focused checks, then broader lint, type-check, test and build commands for affected workspaces.
10. Review the final diff against `.claude/rules/definition-of-done.md`.

## Completion report

- Summarize changed files by area.
- List exact verification commands and results.
- Map each acceptance criterion to evidence.
- State unverified items, known risks and follow-up work.
- Propose `/commit` only when the change is ready.

## Refuse these shortcuts

- Coding against an invented contract or nonexistent pattern.
- Skipping tests, validation or documentation solely to finish faster.
- Mixing unrelated refactors or fixes into the feature.
- Exposing persistence models as accidental public contracts.
- Weakening security, hooks or quality gates.
