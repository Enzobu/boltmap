# Documentation rules

## General

- Keep documentation practical, accurate and aligned with the actual code.
- Follow the repository's existing documentation structure instead of imposing a new one.
- Update documentation when setup, behavior, commands, ports, contracts, environment variables or deployment steps change.
- Do not document behavior that has not been implemented.
- Use relative repository links where practical and avoid duplicated sources of truth.

## Feature documentation

- For substantial or cross-cutting features, maintain a concise feature document when the repository uses `docs/features/` or an equivalent convention.
- Capture objective, scope, business rules, contracts, architecture, tests and relevant user documentation.
- Keep status and last-updated metadata current when the project uses frontmatter.
- Do not require a feature document for trivial internal changes unless the project workflow explicitly does.

## API and integration documentation

- Update OpenAPI/Swagger, GraphQL schemas, event contracts, message topics and API collections when applicable.
- Examples must be realistic and must not contain secrets or production data.
- When a route or payload changes, update all client-facing contract documentation in the same change.

## Architecture decisions

- Use an ADR for decisions that are costly to reverse, affect multiple components or introduce a lasting convention.
- Record context, decision, alternatives and consequences.
- Do not rewrite accepted ADR history; supersede it with a new decision when the project follows immutable ADRs.

## README and operations

- Keep installation, common commands, services, ports and required environment variables current.
- Document new operational steps, migrations, deployment impact and troubleshooting where relevant.
- Use placeholders for secrets and point to `.env.example` or the project's equivalent.

## Comments and release notes

- Comments explain why, invariants or constraints; they do not narrate obvious code.
- Remove outdated comments.
- Release notes must be based on real changes and call out breaking changes clearly.
