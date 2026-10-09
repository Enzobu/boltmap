---
name: create-ticket
description: Create a complete GitHub issue with context, scope, testable acceptance criteria and an applicable Definition of Done.
---


Create a high-quality issue from: $ARGUMENTS

## Workflow

1. Inspect repository issue templates, labels, contribution docs, architecture and relevant specifications.
2. Determine the work type and affected scope from evidence. Ask only when a missing fact materially changes the ticket.
3. Draft the issue using `.agents/templates/issue.md`, removing sections that truly do not apply.
4. Acceptance criteria must describe observable and testable outcomes, not implementation wishes.
5. Use the repository's title convention. Otherwise use `type(scope): imperative description`.
6. Reuse existing labels. Do not invent or create labels without approval.
7. Show the final title and body before creation when material assumptions remain.
8. Create via `gh issue create` only because this command was explicitly invoked, then return the issue URL.

## Rules

- No `TBD`, vague placeholders or arbitrary estimates in the created issue.
- Separate included and excluded scope.
- Mention breaking contracts, migrations, security and operational risks where relevant.
- Link specifications, ADRs, parent issues and dependencies when they exist.
