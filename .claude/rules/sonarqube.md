# SonarQube rules

## General

- Preserve the existing SonarQube configuration unless explicitly requested.
- Do not disable or bypass the quality gate to make a pipeline pass.
- Do not ignore SonarQube issues without explaining why.
- Prefer fixing the root cause instead of suppressing warnings.
- Keep SonarQube configuration aligned with the actual project structure.

## Quality gate

- Treat quality gate failures as real issues to investigate.
- Do not reduce quality thresholds unless explicitly requested.
- Do not remove coverage, duplication, reliability, security, or maintainability checks without approval.
- When a quality gate fails, identify the failing metric and propose the smallest clean fix.

## Coverage

- Keep coverage report paths accurate.
- Do not fake coverage reports.
- Do not add meaningless tests only to increase coverage.
- Prioritize meaningful tests for business logic and critical flows.
- If coverage is missing, check whether the test command generates the expected report.

## Issues

- Fix blocker, critical, security, and reliability issues first.
- Avoid using `// NOSONAR` unless explicitly justified.
- Do not mass-suppress issues.
- For false positives, document why the issue is considered safe.
- Prefer code that is readable and maintainable over code written only to satisfy SonarQube.

## Duplications

- Do not blindly extract duplicated code if it makes the code harder to understand.
- Refactor duplication only when it improves maintainability.
- Keep small, intentional duplication when abstraction would be worse.
- Do not copy-paste large blocks of logic.

## Security hotspots

- Review security hotspots carefully.
- Do not mark a hotspot as safe without checking the context.
- Pay special attention to authentication, authorization, secrets, file access, SQL queries, command execution, and external URLs.

## CI/CD integration

- Keep SonarQube analysis in CI when it already exists.
- Do not remove SonarQube steps from workflows unless explicitly requested.
- Ensure analysis runs after tests when coverage reports are required.
- Keep SonarQube tokens in CI secrets, never in repository files.
- Do not hardcode SonarQube URLs or tokens when environment variables already exist.

## Monorepo

- Respect the existing monorepo SonarQube setup.
- Keep project keys, source paths, test paths, and coverage paths explicit.
- Do not merge multiple app analyses into one configuration unless the project already does it that way.
- When adding a new app or package, update SonarQube paths intentionally.
- Avoid excluding files from analysis unless they are generated, external, or irrelevant.

## Exclusions

- Do not exclude source files to hide issues.
- Exclusions should be limited to generated files, build outputs, dependencies, fixtures, or irrelevant assets.
- Keep exclusions explicit and documented.
- Do not exclude tests from coverage unless there is a valid reason.

## Reporting

- When modifying SonarQube configuration, explain:
  - what changed
  - why it changed
  - which project or app is affected
  - how it was tested
- When an issue remains unresolved, mention it clearly.