# Monorepo rules

- Respect app, service and package boundaries.
- Deployable apps must not import private source from other deployable apps.
- Put genuinely shared contracts, schemas, types and utilities in the existing shared package when appropriate.
- Do not create circular dependencies between packages.
- Keep dependency direction explicit and verify it before adding cross-package imports.
- Use workspace-aware commands from the correct root and the existing package manager.
- Add dependencies to the narrowest package that needs them.
- Keep shared dependency versions aligned when practical and consistent with the workspace strategy.
- Rebuild and retest affected consumers after changing shared packages.
- Mention every affected app or package in the implementation summary.
