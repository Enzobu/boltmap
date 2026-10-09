---
description: Refactor safely without changing observable behavior, protected by existing or characterization tests.
argument-hint: <issue number | target and motivation>
---

Refactor the target described by: $ARGUMENTS

## Workflow

1. Load rules and define the exact boundary and motivation.
2. Confirm that no feature or bug fix is intentionally included.
3. Record the observable behavior and public contracts that must remain unchanged.
4. Evaluate test coverage around the target. Add characterization tests before refactoring when behavior is not protected.
5. Detect the correct base branch and create a focused refactor branch when appropriate.
6. Refactor in small comprehensible steps, keeping tests green after each step.
7. Run focused lint, type-check, tests and build commands for the affected area, then broader checks if shared code changed.
8. Verify that endpoints, statuses, payloads, events, UI behavior and database semantics remain unchanged unless the issue explicitly permits a contract change.
9. Update internal implementation documentation or file references where applicable. Public API documentation should not change for a behavior-preserving refactor.

## Rules

- Do not proceed without sufficient tests on risky or critical behavior.
- Do not mix a new feature, bug fix or broad dependency upgrade into the refactor.
- Prefer several coherent transformations over one opaque rewrite.
- Report any behavior difference discovered during verification as a separate issue, not a silent improvement.
