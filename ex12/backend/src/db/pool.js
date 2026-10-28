import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL. Copy .env.example to .env and set your Supabase connection string.');
}
if (databaseUrl.includes('[YOUR-PASSWORD]') || databaseUrl.includes('YOUR_PASSWORD')) {
  throw new Error('Replace the password placeholder in DATABASE_URL before starting the API.');
}

let parsedUrl;
try {
  parsedUrl = new URL(databaseUrl);
} catch {
  throw new Error('DATABASE_URL is not a valid PostgreSQL connection URL.');
}
if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
  throw new Error('DATABASE_URL must use the postgres:// or postgresql:// protocol.');
}

const certificatePath = process.env.DATABASE_SSL_CA_PATH?.trim();
let certificateAuthority;
if (certificatePath) {
  try {
    certificateAuthority = readFileSync(resolve(certificatePath), 'utf8');
  } catch (error) {
    throw new Error(`Unable to read DATABASE_SSL_CA_PATH: ${error.message}`, { cause: error });
  }
}

const poolOptions = { connectionString: databaseUrl, max: 5 };

if (certificateAuthority) {
  for (const parameter of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) {
    parsedUrl.searchParams.delete(parameter);
  }

  poolOptions.connectionString = parsedUrl.toString();
  poolOptions.ssl = {
    ca: certificateAuthority,
    rejectUnauthorized: true,
  };
}

export const pool = new Pool(poolOptions);

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});
