# Package manager rules

- Use the package manager already used by the project.
- If `pnpm-lock.yaml` exists, use pnpm.
- If `package-lock.json` exists, use npm.
- If `yarn.lock` exists, use yarn.
- Do not generate a new lockfile for another package manager.
- Do not update dependencies unless explicitly requested or required.
- Do not modify lockfiles unless dependencies changed intentionally.