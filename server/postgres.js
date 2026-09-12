require('./env');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function createPool() {
  if (!process.env.SUPABASE_DB_URL) {
    throw new Error('Set SUPABASE_DB_URL in the root .env to your Supabase PostgreSQL session-pooler connection string.');
  }
  const url = new URL(process.env.SUPABASE_DB_URL);
  // Enforce verified TLS regardless of connection-string SSL options.
  for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
  return new Pool({
    connectionString: url.toString(),
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(process.env.SUPABASE_DB_CA_FILE || path.join(__dirname, 'certs', 'supabase-ca.crt'), 'utf8'),
    },
    max: process.env.VERCEL ? 3 : 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    options: '-c search_path=public -c timezone=UTC',
  });
}

// Retain the existing parameter-binding interface, with PostgreSQL SQL underneath.
// Ignore question marks inside quoted SQL strings and identifiers.
function bindParameters(sql, params) {
  let index = 0;
  const text = sql.replace(/'(?:''|[^'])*'|"(?:""|[^"])*"|\?/g, token => token === '?' ? `$${++index}` : token);
  if (index !== params.length) throw new Error('SQL parameter count mismatch.');
  return { text, values: params };
}

function createDatabase(pool) {
  return {
    async execute(sql, params = []) {
      const result = await pool.query(bindParameters(sql, params));
      if (result.command === 'SELECT') return [result.rows];
      return [{ affectedRows: result.rowCount, insertId: result.rows[0]?.insertId }];
    },
    end: () => pool.end(),
  };
}

module.exports = { createPool, createDatabase, bindParameters };
