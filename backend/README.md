# BURN-AID API (Express)

Node/Express service that backs authentication, saved assessments, admin video configuration, facility proxying, and JSON-backed “database” files under `backend/data/`.

## Layout

| Path | Role |
|------|------|
| `server.ts` | Single entry: routes, CORS, JSON body parser, health check. |
| `storage/*.ts` | Read/write helpers for `users.json`, `burnResults.json`, `videoSettings.json`, etc. |
| `data/*.json` | Runtime data (users, logs, video config). **Do not commit secrets**; use `.env` in production. |
| `scripts/resetPassword.ts` | Dev utility to fix a user password hash. |

## Environment

- `BACKEND_PORT` — listen port (default `3002`).
- `AUTH_JWT_SECRET` — **required in production**; used to sign session JWTs.
- `GOOGLE_MAPS_API_KEY` / `GOOGLE_PLACES_API_KEY` / `MAPS_API_KEY` — optional; improves `/api/places/nearby` when set; otherwise OSM/Overpass + fallbacks apply.

## Run locally

From the **repository root** (where `package.json` lives):

```bash
npm run dev:backend
```

The API listens on `http://127.0.0.1:3002` unless `BACKEND_PORT` overrides it.
