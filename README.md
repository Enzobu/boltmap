# Boltmap

Boltmap keeps workshop hardware mapped to where it belongs. Put the screws or bolts from a disassembly step in a box, create an entry, and write the generated 4-digit code on the box.

## Features

- Email/password authentication with secure HTTP-only session cookies.
- Projects with isolated entry lists and a separate documentation section.
- Project documentation with randomly generated, stable three-letter codes (unique per project), title, notes and up to 10 attached PDF/images. Codes can be written on physical boxes for lookup.
- Random 4-digit codes from `1000` to `9999`, unique across the entire application (including other projects and users).
- Entry name, quantity and optional notes.
- Instant client-side search by code or name within the selected project, without pagination.
- Authenticated global search by code or name across all owned projects, including archived entries, with direct access to reference details (first 100 matches).
- Create, rename and delete projects.
- Create, edit and delete entries.
- Open any reference for its details and photos; zoom photos in place and transfer the reference to another owned project without changing its code, quantity, notes or attachments.
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
- **Entry** has a global unique `code` constraint, including archived entries. There are 9,000 possible codes across the entire database.

Deleting a project cascades to its entries. Deleting a user cascades to their projects.

## Security notes

- Passwords are hashed with bcrypt.
- Sessions are signed JWTs stored in HTTP-only, SameSite=Lax cookies.
- Project and entry ownership is enforced server-side on every protected API route.
- Do not commit a real `.env` file or production credentials.

Closes are intentionally not automatic: issue lifecycle should be completed only after deployment/acceptance checks.

## Upgrading existing installations

Before deploying the global-uniqueness migration, check whether codes are already duplicated across projects:

```sql
SELECT code, COUNT(*) AS occurrences
FROM Entry
GROUP BY code
HAVING COUNT(*) > 1;
```

**Do not automatically rename existing codes:** physical boxes may already be labelled. If the query returns rows, identify the associated entries with `SELECT e.code, e.id, e.name, p.name AS project FROM Entry e JOIN Project p ON p.id = e.projectId WHERE e.code = '1234';` (replace `1234`) and reconcile each duplicate with the physical labels before migration. The new unique-index migration intentionally fails safely until duplicates are resolved. Back up the database before editing existing records. Both active and archived entries retain their reserved codes.

## Project documentation

Each project has a **Documentation** tab, separate from the four-digit hardware entries.
Create a document for a diagram, valve layout or reference photo and write its generated
three-letter code on the physical box. Codes are unique *within* a project (not across all
projects) and never change when editing a document. Search by code, title or notes within
that project's documentation section.

Attachments are PDF, JPEG, PNG or WebP, up to 15 MiB each and 10 per document.
Files use the existing `IMAGE_VOLUME` bind mount (in a `documents/` subfolder)
and are served only to the project owner. Include this mount in backups.

The database migration creates the `Document` and `DocumentFile` tables. Existing
four-digit entry codes and project records are unaffected. Deploy the migration
before starting the application on an existing installation.
