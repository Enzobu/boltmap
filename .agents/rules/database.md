# Database rules

- Never drop data silently.
- Keep migrations explicit and reviewable.
- Do not edit old migrations unless explicitly requested.
- Do not manually change the database schema instead of creating a migration.
- Use transactions for multi-step data changes when possible.
- Be careful with nullable fields, default values, indexes, and unique constraints.
- Mention data migration risks clearly.
- Do not put real production data in tests or fixtures.