# Backend rules

## General

- Respect the existing backend architecture, framework and conventions.
- Keep controllers, resolvers and handlers thin; place business rules in services, use cases or domain layers.
- Validate external input explicitly and return consistent errors.
- Keep public contracts stable unless a breaking change is requested and documented.
- Do not disable security checks, validation or framework safeguards to make a task pass.

## API boundaries

- Use explicit request and response DTOs, records, serializers or schemas according to project conventions.
- Avoid exposing ORM entities, Prisma models, JPA entities or persistence internals directly.
- Keep mapping logic explicit and testable.
- Never expose sensitive fields, stack traces or internal implementation details.
- Keep authentication and authorization checks server-side and explicit.

## Business and persistence logic

- Keep persistence access out of controllers.
- Use transactions for multi-record changes that must be atomic.
- Handle expected errors and edge cases intentionally; do not catch and ignore exceptions.
- Preserve idempotency where retries are possible.

## Framework-specific guidance

- Symfony / API Platform: follow existing entity, repository, service, controller, processor, provider, validation and serialization-group patterns.
- Java / Spring Boot: prefer records for immutable DTOs when compatible; use POJOs where binding or mutability requires them; map JPA entities explicitly.
- NestJS / Prisma: follow module, controller, service and DTO patterns; keep validation active; run migrations for schema changes.
- Other frameworks: apply the same boundary, validation, mapping and separation principles using native conventions.

## Quality

- Remove debug logs and temporary code.
- Use explicit names and framework-native mechanisms before custom plumbing.
- Add focused tests for business rules, validation, authorization and integrations changed by the task.
