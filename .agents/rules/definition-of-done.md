# Definition of Done

A change is ready only when every applicable item below is satisfied.

## Behavior

- Acceptance criteria are verified against observable behavior.
- Error, empty, loading, validation and authorization paths are handled where relevant.
- Public API, event, message and shared type changes are intentional and documented.
- No unrelated behavior changed accidentally.

## Code

- The implementation follows the existing architecture and naming conventions.
- Business logic is separated from transport, persistence and UI plumbing where the project architecture supports it.
- Dead code, debug output, temporary files and commented experiments are removed.
- Dependencies are added only when justified and with the existing package manager.

## Verification

- Focused tests cover the changed behavior.
- Bug fixes include a regression test unless technically impossible and explicitly explained.
- Refactors are protected by characterization or existing behavior tests.
- Relevant lint, type-check, test and build commands pass.
- Broader checks run when shared code, contracts, infrastructure or public behavior changed.

## Documentation and operations

- README, feature documentation, API docs, collections, diagrams, runbooks and release notes are updated only where applicable.
- `.env.example` or equivalent documents new or changed variables without real values.
- Database migrations are explicit, reversible where practical and reviewed for data risk.
- Docker, CI/CD, monitoring and deployment documentation match the actual configuration.

## Delivery

- The final report lists changed files, commands executed and their results.
- Unverified items, known risks and follow-up work are explicit.
- The PR or commit is focused and references its issue when one exists.
- An issue is closed only after the implementation and delivery checks have been verified, not merely because a PR merged.
