/**
 * Central place for environment variables used by the Express API.
 * Call `dotenv.config()` once here so every module reads the same loaded `.env`.
 */
import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.BACKEND_PORT ?? 3002);

const JWT_SECRET = process.env.AUTH_JWT_SECRET?.trim();
export const USE_FALLBACK_JWT_SECRET = !JWT_SECRET;
export const JWT_SECRET_KEY = JWT_SECRET ?? 'dev-secret-change-me';

if (USE_FALLBACK_JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('Missing AUTH_JWT_SECRET in environment');
}

if (USE_FALLBACK_JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn(
    'WARNING: AUTH_JWT_SECRET is not set. Using an insecure default secret for local development. Set AUTH_JWT_SECRET in .env before deploying.',
  );
}
