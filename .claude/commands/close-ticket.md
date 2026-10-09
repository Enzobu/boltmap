---
description: Verify acceptance criteria and Definition of Done, then close a completed GitHub issue.
argument-hint: <issue number>
---

Verify and close issue: $ARGUMENTS

Invoking this command authorizes closing the specified issue only if all applicable checks pass.

## Workflow

1. Read the complete issue, acceptance criteria, dependencies and linked PRs.
2. Verify every acceptance criterion using code, tests, documentation and runtime evidence where available.
3. Check `.claude/rules/definition-of-done.md` item by item, marking non-applicable items explicitly.
4. Confirm the relevant PR is merged or that the repository's documented closure condition is satisfied.
5. Confirm CI is green on the delivered commit when CI is available.
6. If any required item fails, do not close the issue. List missing evidence and the smallest next actions.
7. If all checks pass, write a concise closure comment summarizing delivered behavior, tests, PRs and known limitations.
8. Close with `gh issue close <id> --reason completed --comment-file <file>`.
9. Return the issue URL and suggest the next related open issue only when it is clearly relevant.

## Rules

- A merged PR alone is not proof that the issue is complete.
- Do not close as `not planned` unless the user explicitly requests abandonment and the reason is documented.
- If acceptance criteria changed, update the issue with justification before closing it.
- Verify blocking dependencies before closure.
