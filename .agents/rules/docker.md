# Docker rules

## General

- Keep Docker configurations simple, explicit, and production-friendly.
- Do not add the `version` attribute in Docker Compose files.
- Always add `restart: unless-stopped` to services unless explicitly requested otherwise.
- Do not expose unnecessary ports.
- Do not hardcode secrets, passwords, tokens, or private keys.
- Use environment variables for credentials and environment-specific values.
- Prefer `.env.example` for documenting required variables.
- Do not commit real `.env` files.

## Docker Compose

- Prefer named volumes for persistent data.
- Use bind mounts mainly for local development.
- Use clear service names.
- Keep containers single-purpose.
- Avoid using `container_name` unless there is a real need.
- Add healthchecks for databases and critical services when useful.
- Use `depends_on` carefully; do not assume it waits for app readiness unless healthchecks are configured.

## Dockerfiles

- Prefer small and stable base images.
- Use multi-stage builds when it reduces final image size or separates build/runtime dependencies.
- Do not install unnecessary packages.
- Keep layer caching in mind by copying dependency files before source files.
- Do not run production containers as root when the image and project allow a non-root user.
- Do not copy secrets into images.

## Networking

- Do not publish internal service ports unless they need to be accessed from outside Docker.
- Prefer internal Docker networks for service-to-service communication.
- Do not expose databases publicly unless explicitly requested and protected.

## Production

- Production Compose files must avoid development-only mounts and commands.
- Production services must use stable commands and explicit environment variables.
- Logs should go to stdout/stderr unless the project already uses another logging strategy.
