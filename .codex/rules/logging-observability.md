# Logging and observability rules

- Use the existing logging and monitoring system rather than introducing parallel mechanisms.
- Prefer structured logs when the project supports them.
- Use consistent levels: debug for development details, info for normal operations, warn for recoverable abnormal conditions and error for failures requiring attention.
- Log useful context, not noise; include correlation or request identifiers where available.
- Propagate correlation identifiers across internal HTTP, messaging and background-job boundaries when the architecture supports it.
- Never log secrets, tokens, passwords, private keys, sensitive personal data or unredacted payloads containing them.
- Do not swallow exceptions silently; log or report them at the boundary responsible for recovery.
- Keep client-facing errors generic and actionable while retaining detailed server-side diagnostics.
- Maintain liveness and readiness checks for services where applicable; readiness should verify critical dependencies.
- Update metrics, alerts, dashboards and runbooks when a change affects operational behavior.
