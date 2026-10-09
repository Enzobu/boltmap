# Frontend rules

## General

- Respect the existing frontend architecture, design system and state-management conventions.
- Reuse existing components, hooks, services, utilities, tokens and styles before creating new ones.
- Do not introduce a new UI, form, state or data-fetching library without a concrete need and explicit approval.
- Keep components small, accessible and focused on presentation or orchestration.

## Components and state

- Prefer functional components where the framework supports them.
- Keep side effects in the framework's appropriate lifecycle primitives.
- Keep state as local as possible and avoid duplicating server state.
- Extract hooks or services when logic is reused or when it separates data access from presentation.
- Do not re-declare API types when shared or generated contracts exist.

## UX and styling

- Follow the existing Tailwind, shadcn, CSS, component-library and token conventions.
- Preserve the established visual language instead of redesigning unrelated screens.
- Design mobile-first when responsive behavior is required.
- Handle loading, empty, error, success, disabled and permission states.
- Use semantic elements, labels, keyboard support and accessible interactions; do not replace buttons with clickable generic containers.

## API calls

- Centralize API calls according to existing client or hook patterns.
- Use environment configuration for base URLs and public flags.
- Do not silently swallow errors or leak technical details to users.
- Keep caching, retries and invalidation explicit where a data-fetching library is used.

## Quality

- Remove unused imports, debug logs, temporary copy and commented experiments.
- Add component or journey tests for changed behavior at the level used by the project.
