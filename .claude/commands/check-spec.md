---
description: Audit the implementation against a requirements document, specification or statement of work.
argument-hint: [spec path and optional section]
---

Audit specification compliance for: $ARGUMENTS

## Workflow

1. Locate the source-of-truth specification from the argument or likely repository files such as requirements, CDC, SOW, acceptance criteria or product docs. Do not invent requirements.
2. If several candidates exist, select the one referenced by project docs or the user and state the choice.
3. Delegate the read-only audit to `spec-reviewer`.
4. Map every in-scope requirement to one status:
   - `DONE`: implemented and evidenced;
   - `PARTIAL`: started but incomplete;
   - `MISSING`: no implementation evidence;
   - `OUT OF SCOPE`: explicitly excluded or deferred by the source of truth;
   - `UNVERIFIED`: implementation may exist but cannot be verified.
5. Cite repository paths and precise sections or lines for each verdict.
6. For partial or missing items, propose the smallest concrete next action.
7. End with overall coverage, blockers, major risks and ordered priorities.

This workflow is read-only. Do not modify code or documentation.
