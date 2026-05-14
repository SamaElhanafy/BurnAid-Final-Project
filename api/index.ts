/**
 * Vercel Serverless Function entry: re-exports the Express app.
 * `vercel.json` rewrites `/api/*` to this handler so all Express routes stay under `/api/...`.
 */
import app from '../backend/server';

export default app;
