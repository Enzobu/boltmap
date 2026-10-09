# Security rules

## Secrets and configuration

- Never hardcode or commit secrets, tokens, passwords, private keys, API keys or credentials.
- Keep real `.env` files out of version control and maintain a safe `.env.example` or equivalent.
- Treat frontend-exposed environment variables as public.
- Validate required environment variables and fail fast on invalid production configuration.
- Use the existing secret manager or CI secret store.

## Authentication and authorization

- Never disable authentication, authorization, CSRF, TLS verification or security middleware simply to make a feature work.
- Enforce permissions on the server for every sensitive operation.
- Apply least privilege to users, service accounts, database users, containers and CI tokens.
- Prefer secure cookie or token storage patterns appropriate to the architecture; document significant auth decisions.

## Input, output and APIs

- Validate and normalize untrusted input at every external boundary.
- Reject unexpected fields when the framework and compatibility requirements allow it.
- Protect against SQL injection, command injection, path traversal, SSRF, XSS, unsafe deserialization and unrestricted file upload.
- Use explicit CORS allowlists in production; do not use `*` with credentials.
- Apply rate limiting and abuse protection to exposed or sensitive endpoints when appropriate.
- Do not expose stack traces, internal paths, dependency versions, database structure or sensitive fields to clients.

## Infrastructure and dependencies

- Do not expose databases, admin panels, dashboards or internal services publicly unless explicitly required and protected.
- Avoid root containers where the image and project support a non-root user.
- Add only maintained and necessary dependencies.
- Investigate critical vulnerabilities and security hotspots; do not suppress them without a documented justification.

## Logging and tests

- Never place real credentials or production data in logs, fixtures, screenshots, documentation or test snapshots.
- Security controls should have focused tests for critical access and validation paths.
