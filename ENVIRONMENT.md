# Environment and local setup

This file explains the minimal environment variables required to run the app locally. Do NOT check real secrets into source control — use `.env` (gitignored) or your hosting provider's secret store.

Required (for basic local dev):

- SUPABASE_URL — your Supabase project URL (e.g. https://xxxxx.supabase.co)
- SUPABASE_KEY — public anon key (used by client)

Optional but required for some server operations (keep server-only):

- SUPABASE_SERVICE_KEY — service role key (admin) — DO NOT expose to client

Quick local steps:

1. Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
# edit .env and paste real values
```

2. Install deps and run dev server:

```bash
npm install
npm run dev
```

3. If you need to run import scripts that modify the DB (data/migrations), provide `SUPABASE_SERVICE_KEY` in environment or CI secrets.

Security notes:

- Keep `SUPABASE_SERVICE_KEY` in server-only secrets. The project exposes `SUPABASE_URL` and `SUPABASE_KEY` to the client via Nuxt public runtime config; that is expected. The service key is intentionally defined as server-only in `nuxt.config.ts`.
- Review CI and hosting settings to ensure server-only keys are not injected into client bundles.
