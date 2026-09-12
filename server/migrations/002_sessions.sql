CREATE SCHEMA IF NOT EXISTS smartcampus_private;
REVOKE ALL ON SCHEMA smartcampus_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS smartcampus_private.sessions (
  sid varchar PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expire_idx ON smartcampus_private.sessions (expire);
REVOKE ALL ON smartcampus_private.sessions FROM PUBLIC, anon, authenticated;
