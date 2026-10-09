# TypeScript rules

- Preserve strictness and do not disable compiler options to bypass errors.
- Avoid `any`; prefer `unknown` with explicit narrowing when input is untrusted.
- Use explicit return types for public APIs and shared library boundaries when it improves the contract.
- Reuse existing types, schemas and shared contracts before creating new ones.
- Do not duplicate backend and frontend contract types when a shared or generated source exists.
- Treat type assertions as an escape hatch; justify unsafe casts and prefer runtime validation at external boundaries.
- Prefer discriminated unions, exhaustive checks and readonly data where they simplify correctness.
- Keep naming, module syntax and import conventions aligned with the project's TypeScript configuration.
