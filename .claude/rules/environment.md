# Environment rules

- Do not hardcode environment-specific values.
- Use environment variables for URLs, ports, credentials, and feature flags.
- Keep `.env.example` updated when adding variables.
- Never commit real `.env` files.
- Keep dev, test, preprod, and prod configurations separated.
- Do not use production credentials in local or test environments.