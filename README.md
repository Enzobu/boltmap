# Boltmap

Boltmap keeps workshop hardware mapped to where it belongs. Put the screws or bolts from a disassembly step in a box, create an entry, and write the generated 4-digit code on the box.

## Features

- Email/password authentication with secure HTTP-only session cookies.
- Projects with isolated entry lists.
- Random 4-digit codes from `1000` to `9999`, unique inside each project.
- Entry name, quantity and optional notes.
- Instant client-side search by code or name, without pagination.
- Create, rename and delete projects.
- Create, edit and delete entries.
- Responsive mobile-first interface.
- Light, dark and system themes with a persistent 3-way theme control.
- MariaDB persistence through Prisma.

## Local development

Requirements:

- Node.js 22+
- MariaDB 11+ (or a compatible MySQL server)

Copy the environment template:

```bash
cp .env.example .env
```

Set a real database URL and generate a strong `AUTH_SECRET` (32+ characters), then install and initialize the database:

```bash
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

## Docker

Copy `.env.example` to `.env`, replace every placeholder value, then run:

```bash
docker compose up -d --build
```

Only the application port is published. MariaDB stays on the internal Docker network.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Data model

- **User** owns projects.
- **Project** owns entries.
- **Entry** has a unique `(projectId, code)` constraint.

Deleting a project cascades to its entries. Deleting a user cascades to their projects.

## Security notes

- Passwords are hashed with bcrypt.
- Sessions are signed JWTs stored in HTTP-only, SameSite=Lax cookies.
- Project and entry ownership is enforced server-side on every protected API route.
- Do not commit a real `.env` file or production credentials.

Closes are intentionally not automatic: issue lifecycle should be completed only after deployment/acceptance checks.
