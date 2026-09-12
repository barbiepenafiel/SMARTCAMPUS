const path = require('path');
const dotenv = require('dotenv');

// Keep existing server settings; also load Supabase settings from the root .env.
// Environment variables supplied by the host always take precedence.
dotenv.config({ path: [path.join(__dirname, '.env'), path.join(__dirname, '..', '.env')], quiet: true });
