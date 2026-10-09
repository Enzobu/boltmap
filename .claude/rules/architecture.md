# Architecture rules

## General

- Respect the existing folder structure and architectural style.
- Do not introduce a new architecture, framework or major abstraction without explicit approval.
- Reuse existing services, hooks, components, helpers, modules and conventions before adding equivalents.
- Prefer simple and explicit designs over speculative extensibility.

## Dependency direction

- Keep domain and business rules independent from frameworks, transport and persistence when the existing architecture allows it.
- Dependencies should point toward stable business abstractions rather than outward toward infrastructure details.
- Use ports or interfaces at boundaries where they improve testability and the pattern already exists or is justified.
- UI code must not contain backend business rules; controllers and handlers must not contain persistence-heavy logic.
- Cross-application communication must use explicit contracts and supported integration mechanisms, not private imports between deployable apps.

## Responsibilities

- A module, class, component or function should have one coherent reason to change.
- Keep controllers and route handlers thin.
- Keep infrastructure details out of domain logic.
- Do not mix unrelated responsibilities in one file merely to reduce file count.

## Changes

- Make the smallest reasonable change that solves the requested problem.
- Avoid broad refactors during a feature or bug fix unless required for correctness.
- Do not rename files, classes, routes, endpoints or public APIs without a concrete reason.
- Record or mention material architectural and breaking changes.

## Monorepo

- Respect app and package boundaries and the existing dependency direction.
- Shared contracts and utilities belong in the existing shared package when appropriate.
- Do not create circular dependencies or imports from reusable packages into deployable apps.
- Rebuild and retest consumers after changing shared packages.

## Maintainability

- Prefer readable code over clever code.
- Use explicit names and small cohesive units.
- Treat file and function size as signals, not arbitrary quotas.
- Extract abstractions only when they remove real duplication, clarify a boundary or simplify testing.
