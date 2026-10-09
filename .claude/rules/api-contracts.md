# API contracts rules

- Keep request, response, event and message contracts explicit, stable and versioned when needed.
- Do not silently rename, remove or reinterpret fields used by consumers.
- Update shared contracts, backend DTOs, validation schemas, generated clients and frontend types together.
- Never expose persistence entities or ORM models as accidental public contracts.
- Use explicit input and output models where the project conventions support them.
- Validate incoming contracts at the boundary and map them to internal domain models.
- Document status codes, error shapes, pagination, nullability, defaults and backward-compatibility behavior.
- Mention breaking changes and migration paths clearly.
- Rebuild and test all known consumers after changing a shared contract.
