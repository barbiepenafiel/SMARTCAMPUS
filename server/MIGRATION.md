# MySQL to Supabase PostgreSQL

The backend now uses PostgreSQL for all application queries. Express sessions and bcrypt passwords remain in use; existing accounts are imported into the application `USERS` table, not Supabase Auth. Node.js 22+ is required.

## Connection

Add `SUPABASE_DB_URL` to the root `.env`. Copy the **Session pooler** connection string from the Supabase dashboard's **Connect** panel, replace the password placeholder, and percent-encode special characters in the password. API keys cannot create PostgreSQL tables.

```env
SUPABASE_DB_URL=postgresql://postgres.PROJECT_REF:ENCODED_PASSWORD@POOLER_HOST:5432/postgres
# Optional: path to the CA certificate downloaded from Supabase database settings.
SUPABASE_DB_CA_FILE=
```

TLS certificate verification is enabled. If the certificate chain is not trusted, download the project's CA and set `SUPABASE_DB_CA_FILE`; do not disable verification. Host environment variables override `server/.env`, which overrides root `.env`.

See [Supabase's connection documentation](https://supabase.com/docs/guides/database/connecting-to-postgres).

## Apply schema

From `server/`:

```sh
npm install
npm test
npm run db:migrate
```

Schema creation is transactional and tracked in `smartcampus_migrations`. Re-running an applied migration is safe. If application tables already exist without migration history, the migration stops for schema review. The application refuses startup until this migration is applied.

Tables use their existing column names and numeric IDs. Foreign keys cascade device deletions and clear deleted user references. RLS and revoked browser-role privileges prevent direct browser access, including access to password hashes. Existing Express authentication and role checks protect the backend routes.

The schema also preserves location descriptions/coordinates, device creation timestamps/coordinates, log timestamps, and connection port information. Historical connections with NULL ports are retained, including repeated device pairs allowed by MySQL. New discovery links use an empty port string so repeated scans can update the same link.

## Transfer existing data

1. Stop the old backend and any writers before the final transfer.
2. Start the old MySQL server. Keep its existing `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` values in `server/.env`.
3. Set `MYSQL_DATETIME_OFFSET` in root `.env` to the timezone used for old MySQL **DATETIME** values: `+08:00` for Manila wall-clock values or `+00:00` for UTC. MySQL **TIMESTAMP** values are read in UTC automatically.
4. Run `npm run db:import:mysql` from `server/`.
5. After the import reports a committed transaction, run `npm start` and verify login, devices, alerts, and reports.

The importer reads a consistent MySQL snapshot and writes one PostgreSQL transaction. It checks row counts, preserves password hashes and IDs, resets identity sequences, and rolls back on failure. It refuses any populated destination table and rejects unmapped source columns rather than silently dropping them. MySQL source rows are never changed. All seven source tables must exist; resolve missing or unmapped schema before retrying.

The checked-in `smartcampus_backup.sql` currently contains a failed mysqldump error, not restorable data. A running source database or a valid backup is required to transfer old records. To start fresh intentionally, skip the import and register a new account after applying the schema.

After importing, existing roles are preserved. For a fresh database, promote your own account in the Supabase SQL editor:

```sql
UPDATE public."USERS" SET "Role" = 'Admin' WHERE "Email" = 'your@email.com';
```

## Validation

`npm test` uses local PostgreSQL (PGlite) to parse and plan every application query, including dynamic filters. It exercises registration ID results, case-insensitive email uniqueness, device-link upserts, fractional uptime calculations, cascading deletes, and browser-role access restrictions. This does not replace a live connection and application smoke test after migration.
