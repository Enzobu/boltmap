---
description: Fix a bug test-first: reproduce, add a failing regression test, correct the root cause and verify no regression.
argument-hint: <issue number | bug description>
---

Fix the bug described by: $ARGUMENTS

## Workflow

1. Load rules and inspect the bug report, affected code and recent related changes.
2. Establish exact reproduction steps and expected behavior from evidence.
3. Create or link an issue for a non-trivial bug when the repository uses issue tracking.
4. Detect the correct base branch and create a focused fix branch when appropriate.
5. Reproduce the bug locally or with the smallest reliable scenario.
6. Add a regression test that fails for the expected reason.
7. Verify the test fails before modifying production behavior.
8. Find and fix the root cause with the smallest clean change.
9. Run the regression test, affected test suite and broader checks required by shared impact.
10. Update contracts, docs, collections or environment examples only if the bug fix changes them.
11. Review for accidental refactor or feature creep.

## Rules

- Do not hide the symptom with a catch-all, hardcoded value or disabled validation.
- Do not remove or weaken an existing test.
- Keep unrelated cleanup in a separate issue or change.
- If an automated regression test is technically impossible, explain why and provide a repeatable alternative verification.
- Final report must include reproduction, root cause, fix, regression test and commands run.
