# CI/CD rules

## General

- Keep CI/CD workflows simple, explicit, and maintainable.
- Do not add secrets directly in workflow files.
- Use GitHub Secrets, environment variables, or the existing secret management system.
- Do not remove quality gates unless explicitly requested.
- Do not deploy production from non-release branches unless explicitly requested.

## GitHub Actions

- Reuse existing workflow conventions.
- Prefer clear job names and step names.
- Avoid duplicating logic when a shared step or reusable workflow already exists.
- Use dependency caching when useful, but do not make workflows fragile.
- Keep permissions as restrictive as possible.
- Pin actions to stable major versions unless the project requires a specific version.

## Build

- Ensure builds use the same package manager as the project.
- Do not mix npm, yarn, and pnpm unless the project already does.
- Do not skip build steps silently.
- Keep monorepo build order explicit when needed.

## Deploy

- Keep deployment commands explicit and easy to audit.
- Do not deploy without a clear branch, tag, or environment rule.
- Keep dev, preprod, and prod environments separated.
- Do not hardcode production URLs, tokens, or server credentials.
- When editing deploy configuration, mention the affected environment.

## Sonar / Quality gates

- Preserve existing SonarQube quality gates.
- Do not bypass tests, lint, or analysis without explicit approval.
- Keep coverage report paths aligned with the project structure.
