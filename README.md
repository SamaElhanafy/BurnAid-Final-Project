# BURN-AID
---

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | React 19 + Vite 6 + Tailwind 4 SPA (`frontend/src/…`) |
| `backend/` | Express REST API, JSON file storage under `backend/data/` |
| `burn_model_api/` | FastAPI + PyTorch service exposing `/predict` for burn images |
| `.env` | Local secrets (use `.env.example` as a template) |

---

## Prerequisites

- **Node.js** 20+ (for `npm` scripts)
- **Python** 3.10+ with `pip` (for the burn model API)
- Optional: **Google Maps / Places** API key for richer hospital search

---

## Install dependencies

From the repository root:

```bash
npm install
```

Python model service:

```bash
cd burn_model_api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Place your trained weights where `burn_model_api/app.py` expects them, or set `BURN_MODEL_WEIGHTS` in the environment (see `app.py`).

---

## Environment variables

Copy `.env.example` to `.env` at the **repo root** (same folder as `package.json`). Vite loads env from there via `frontend/vite.config.ts`.

Minimum for local full stack:

- `VITE_BACKEND_URL` — default `http://127.0.0.1:3002`
- `VITE_BURN_MODEL_API` — default `http://127.0.0.1:8000`
- `AUTH_JWT_SECRET` — any long random string (required in production)
- `GEMINI_API_KEY` — if you use Google GenAI features from the frontend build

---

## Run locally

**Terminal 1 — Python model (port 8000)**

```bash
cd burn_model_api
.venv\Scripts\activate
uvicorn app:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — Express API (port 3002)**

```bash
npm run dev:backend
```

**Terminal 3 — Vite dev server (port 3000)**

```bash
npm run dev
```

**All three at once (Windows paths for the model are already in `package.json`):**

```bash
npm run dev:all
```

- Frontend: `http://localhost:3000`
- Backend health: `http://127.0.0.1:3002/api/health`
- Model: `http://127.0.0.1:8000` (see FastAPI docs at `/docs` if enabled)

---

## Production build (frontend)

```bash
npm run build
```

Static output: `frontend/dist/`. Preview locally:

```bash
npm run preview
```

---

## Frontend components (high level)

State and side effects are centralized in `frontend/src/context/useBurnAidController.ts` and exposed through `BurnAidProvider` / `useBurnAid()`.

| Area | Files | Purpose |
|------|--------|--------|
| Shell | `components/layout/BurnAidShell.tsx`, `AppHeader.tsx`, `AppFooter.tsx`, `MobileBottomNav.tsx`, `EmergencyCallModal.tsx`, `MainViewRouter.tsx` | Global chrome, routing between “views”, mobile tabs |
| Assessment | `components/assessment/*.tsx`, `views/AssessmentView.tsx` | Upload, preview, progress, results, sidebar SOS/tips |
| Screens | `components/views/*.tsx` | Landing, Emergency, Documentation, Videos, Account, Admin, etc. |
| Auth | `components/auth/AuthFormView.tsx`, `ChangePasswordCard.tsx` | Login/register and password change |
| Chat | `components/chat/ChatbotModal.tsx` | Guided first-aid dialog |
| Data / i18n | `constants/`, `i18n/translations.ts`, `types/burnAid.ts` | Shared config and copy |

Each file includes a short comment at the top describing its responsibility.

---

## Backend modules

| Path | Purpose |
|------|--------|
| `backend/server.ts` | Express app and route registration |
| `backend/env.ts` | `dotenv` + `PORT` / JWT secret validation |
| `backend/middleware/auth.ts` | JWT bearer auth and admin guard |
| `backend/services/nearbyFacilities.ts` | Overpass, optional Google Places, Egypt fallbacks |
| `backend/storage/*.ts` | Read/write JSON “database” in `backend/data/` |

---

## Hosting on Vercel

This repo includes **`vercel.json`** and **`api/index.ts`** so you can deploy **frontend + Express API in a single Vercel project** (static `frontend/dist` + one serverless function for all `/api/*` routes).

**Step-by-step checklist:** see **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** (env vars, first deploy, `/api/health` test, limitations).

**Caveats**

- **`backend/data/*.json`** is not a reliable database on Vercel; use a hosted DB for production persistence.
- **Burn model** (`burn_model_api`) must be hosted separately; set **`VITE_BURN_MODEL_API`** on Vercel.
- To run API on **another** host only, set **`VITE_BACKEND_URL`** to that API’s public URL; otherwise leave it unset so the browser uses the same Vercel hostname.

---

## Presentation checklist

- **Problem:** gap between injury and hospital care; need fast, bilingual guidance.
- **Solution:** image-based triage model + structured first-aid content + emergency tools.
- **Architecture:** React SPA → Express API + JSON store; FastAPI for `/predict`; optional Google/Overpass for maps.
- **Ethics / limits:** disclaimer, privacy (images), no formal diagnosis, Egypt-centric facility defaults.
- **Demo path:** Landing → Assessment → upload demo image → show degree + advice → Emergency / map.

---

## NPM scripts (root `package.json`)

| Script | Meaning |
|--------|--------|
| `npm run dev` | Vite dev server |
| `npm run dev:backend` | Express with `tsx` |
| `npm run dev:model` | Uvicorn for `burn_model_api` (Windows venv path) |
| `npm run dev:all` | Model + backend + frontend via `concurrently` |
| `npm run build` | Production build → `frontend/dist` |
| `npm run lint` | `tsc --noEmit` across `frontend/src` and `backend` |
| `npm run dev:reset-password` | Dev utility to reset a user password in JSON store |

---

## License / academic use

Use and attribution policies depend on your institution; this README is intended for graduation-project documentation and deployment notes.
