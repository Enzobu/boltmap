---
name: review
description: Review current changes against requirements, project rules, security, tests and Definition of Done without modifying code.
---


Review: $ARGUMENTS

## Workflow

1. Load relevant rules and identify the review target. Default to unstaged and staged local changes.
2. Read the linked issue, specification or PR description when available.
3. Inspect the complete diff and surrounding code needed to understand behavior.
4. Check correctness, regressions, public contracts, architecture boundaries, security, data migration, error handling, concurrency, performance and operations where relevant.
5. Check whether tests meaningfully cover the changed behavior and whether documentation/configuration stayed synchronized.
6. Do not modify code during this workflow.

## Report format

List findings first, ordered by severity:

- `BLOCKER`: data loss, security exposure, broken production path or invalid delivery.
- `HIGH`: likely functional regression, broken contract or missing critical test.
- `MEDIUM`: maintainability, edge-case or operational risk worth fixing before merge.
- `LOW`: minor improvement or consistency issue.

For every finding include:

- file and precise location;
- observed problem;
- concrete impact;
- smallest recommended correction.

Then add:

- assumptions and open questions;
- verification gaps;
- concise overall readiness verdict.

If no finding exists, say so explicitly but still mention remaining test or environment limitations.
