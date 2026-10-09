# Testing rules

## General

- Add or update tests when observable behavior or business logic changes.
- Prefer the project's existing tools, directory structure, builders and fixtures.
- Test behavior rather than implementation details unless the implementation detail is the contract under test.
- Keep tests deterministic, isolated and readable.
- Never delete a test, weaken an assertion or disable a suite merely to make checks pass.
- Never claim tests passed unless they were executed successfully.

## Strategy

- Use many focused unit tests for pure business logic.
- Use integration tests where persistence, messaging, filesystem, HTTP clients or framework wiring are part of the behavior.
- Reserve end-to-end tests for critical user or system journeys.
- Prefer Arrange / Act / Assert or the equivalent structure used by the project.
- Cover success paths, validation, authorization, errors and important edge cases where relevant.

## Bugs and refactors

- Reproduce a bug before fixing it when possible.
- Add a failing regression test first, verify that it fails for the expected reason, then implement the fix.
- If a regression test is impossible, explain the technical reason and provide another reproducible verification.
- Before a refactor, ensure the affected behavior is protected by existing tests or add characterization tests.
- Keep tests green after each meaningful refactor step.

## Running tests

- Run the smallest relevant command first for fast feedback.
- Run broader tests when shared code, configuration, infrastructure or public contracts change.
- Use a dedicated disposable environment for tests that require a real database, broker or external service.
- Seed only the data needed and clean up when the test environment requires it.
- Report the exact commands run and any checks that could not be executed.

## Coverage

- Coverage is a signal, not the goal.
- Prioritize critical business rules and failure paths.
- Do not add meaningless tests or fake reports to satisfy a threshold.
- Preserve existing coverage and quality gates unless the user explicitly changes them.
