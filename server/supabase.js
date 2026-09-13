require('./env');

let clients;
function getSupabaseClients() {
  if (!clients) {
    // Use the ESM entry point: Vercel cannot require jose's ESM dependency.
    clients = import('@supabase/server/core').then(({ createContextClient, createAdminClient }) => ({
      supabase: createContextClient(),
      supabaseAdmin: createAdminClient(),
    })).catch(error => {
      clients = undefined;
      throw error;
    });
  }
  return clients;
}

// Read-only checks; no application tables or user accounts are changed.
async function checkSupabaseConnection() {
  await getSupabaseClients();
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  const checks = [
    ['publishable key', `${base}/auth/v1/settings`, process.env.SUPABASE_PUBLISHABLE_KEY],
    ['secret key', `${base}/auth/v1/admin/users?page=1&per_page=1`, process.env.SUPABASE_SECRET_KEY],
    ['database API', `${base}/rest/v1/`, process.env.SUPABASE_SECRET_KEY],
    ['JWKS', process.env.SUPABASE_JWKS_URL || `${base}/auth/v1/.well-known/jwks.json`],
  ];
  for (const [name, url, key] of checks) {
    const response = await fetch(url, {
      headers: key ? { apikey: key } : {},
      signal: AbortSignal.timeout(15000),
    });
    await response.body?.cancel();
    if (!response.ok) throw new Error(`Supabase ${name} check failed (HTTP ${response.status}).`);
  }
  return { connected: true };
}

module.exports = { getSupabaseClients, checkSupabaseConnection };

if (require.main === module) {
  checkSupabaseConnection().then(() => {
    console.log('Supabase connection verified: publishable key, secret key, database API, and JWKS.');
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
