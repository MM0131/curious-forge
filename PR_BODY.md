This PR adds health and monitor endpoints, Vitest unit tests for `useSaved` and `useSupabase`, ESLint/Prettier configuration, and a CI workflow that runs tests and lints only changed files.

Notes:
- `SUPABASE_SERVICE_KEY` remains server-only (used in server routes).
- `scripts/` is intentionally ignored by ESLint to avoid legacy noise; a follow-up PR will clean scripts.

Follow-ups:
- Add coverage reporting and e2e smoke tests (separate PR).
