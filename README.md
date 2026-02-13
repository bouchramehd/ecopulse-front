# EcoPulse

EcoPulse is a full-stack environmental risk dashboard (flood + drought) with a FastAPI backend and a React/Vite frontend.

## Monorepo structure

- `backend/`: FastAPI API and data pipeline files (`bronze/`, `silver/`, `gold/`)
- `frontend/`: React dashboard (Vite + Tailwind + Recharts + Leaflet)
- `vercel.json`: unified deployment config (frontend + `/api` backend routing)

## Local development

### 1) Backend

From repository root:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.app:app --reload --port 9000
```

Backend URLs:
- API: `http://127.0.0.1:9000`
- Docs: `http://127.0.0.1:9000/docs`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

The frontend calls `/api/*`; in local dev, Vite proxies `/api` to `http://127.0.0.1:9000`.

## API endpoints

- `GET /` health message
- `GET /zones`
- `GET /risk/{zone_id}`
- `GET /top_flood?n=5`
- `GET /top_drought?n=5`

## Vercel deployment

This repo is configured for a single Vercel project:

- Frontend is built from `frontend/`
- Backend is deployed from `backend/app.py`
- Requests to `/api/*` are rewritten to the FastAPI app

### Optional environment variables

- `VITE_API_BASE_URL`: frontend API base URL (default `/api`)
- `FRONTEND_ORIGIN`: frontend URL allowed by backend CORS for local/custom setups

Example:

- `VITE_API_BASE_URL=/api`
- `FRONTEND_ORIGIN=https://your-app.vercel.app`

## Environment file

A single root `.env` is used for both apps:

```bash
VITE_API_BASE_URL=/api
FRONTEND_ORIGIN=http://localhost:5173
```

Notes:
- Frontend reads this root file via `frontend/vite.config.js` (`envDir: '..'`).
- Backend reads it via `python-dotenv` in `backend/app.py`.
- On Vercel, set the same variables in Project Settings → Environment Variables.

## Notes

- Keep Python dependencies only in root `requirements.txt`.
- Keep project docs only in this root `README.md`.
- Keep git ignore rules only in root `.gitignore`.
