# Deploy BURN-AID on Vercel (frontend + API together)

This repo is set up for **one Vercel project** that serves:

- **Static UI** from `frontend/dist` (Vite build)
- **Express API** as a single Serverless Function at `api/index.ts`, with all routes still under `/api/...`

Your production URL will look like `https://<project>.vercel.app`. The app uses **same-origin** API calls in production (no `VITE_BACKEND_URL` required unless the API lives on another domain).

---

## Before you deploy (important)

### 1. JSON database on Vercel

The backend writes to `backend/data/*.json`. On Vercel, the filesystem for your function is **not a durable database**: writes may **fail** or **reset** between invocations. For a real graduation/demo in production, plan to move users/history to **Vercel Postgres**, **PlanetScale**, **Supabase**, or another hosted DB. Until then, treat production as **read-mostly** or accept that signups/history may not persist.

### 2. Python burn model

The classifier is **not** part of this Node bundle. Host `burn_model_api` elsewhere (Railway, Render, Fly.io, a VM), then set **`VITE_BURN_MODEL_API`** in Vercel to that service’s public URL (e.g. `https://your-model.railway.app`).

---

## One-time: push the repo to GitHub

1. Create a repository on GitHub and push this project (if you have not already).

---

## Create the Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is fine).
2. **Add New… → Project**.
3. **Import** your GitHub repo.
4. Leave **Root Directory** as the repository root (`.`).
5. Vercel should pick up **`vercel.json`**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install`
   - **Framework Preset:** Other (or “No framework”); do **not** force “Vite” at repo root unless you confirm it still uses these settings.
6. Open **Environment Variables** and add:

| Name | Value | Notes |
|------|--------|--------|
| `AUTH_JWT_SECRET` | Long random string | **Required** in production (see `backend/env.ts`). |
| `GEMINI_API_KEY` | Your key | If the UI uses Gemini features at build/runtime. |
| `GOOGLE_MAPS_API_KEY` or `GOOGLE_PLACES_API_KEY` | Optional | For richer `/api/places/nearby`. |
| `VITE_BURN_MODEL_API` | `https://...` | **Required** for real assessments if the model is external. |
| `VITE_BACKEND_URL` | *(omit)* | Leave unset so the client uses `window.location.origin` on your Vercel URL. Set only if the API is on **another** hostname. |

7. Click **Deploy**.

---

## After the first deploy

1. Open the production URL and check **`/api/health`** (e.g. `https://<project>.vercel.app/api/health`). You should see `{"ok":true}`.
2. Open the **homepage** and smoke-test login/assessment (remember JSON persistence limits).
3. If **`/api/*` returns 404**, confirm `vercel.json` is committed and that the **rewrites** section is present. Redeploy.

---

## Optional: two separate Vercel projects

Most teams use **one** project (this setup). If you ever split:

- **Frontend project:** you would need a clean way to avoid deploying `api/` or point `VITE_BACKEND_URL` at the second URL (and handle CORS).
- **Backend-only project:** same Express-on-serverless pattern, but **no** `outputDirectory` / static build—only the `api` function. That usually means a **second repo** or a **monorepo subfolder** with its own `vercel.json`.

For your thesis, **one project** is simpler and matches the config in this repository.

---

## Local vs production

| Environment | Frontend | API |
|-------------|----------|-----|
| Local | `npm run dev` → port 3000 | `npm run dev:backend` → port 3002 |
| Vercel | Same host as static files | `/api/*` → `api/index.ts` |

---

## Troubleshooting

- **Cold starts:** first request after idle can be slow; normal on Hobby.
- **Timeouts:** Overpass / Places can be slow; Vercel **Hobby** functions have a **10s** limit (upgrade or optimize calls if you hit timeouts).
- **CORS:** Already relaxed in `server.ts` (`origin: true`). If you split domains later, tighten CORS to your frontend URL only.
