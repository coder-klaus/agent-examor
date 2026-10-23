## Why

Admin and mutating API routes are open on the LAN; anyone can change LLM keys, decks, and backups. Personal deployment needs a simple operator login while keeping the learner web review path usable without admin access.

## What Changes

- `ADMIN_PASSWORD` in `.env` (documented default `huaerjie001` for local dev).
- `POST /api/v1/auth/login`, `GET /api/v1/auth/session`, `POST /api/v1/auth/logout` with `httpOnly` session cookie.
- Session middleware on `/api/v1/*` except health, auth, and learner review (`GET review/*`, `POST cards/:id/grade`).
- Admin UI login screen; API calls use `credentials: 'include'`.
- MCP remains API-key authenticated (unchanged).

## Capabilities

### New Capabilities

- `admin-auth`: Password gate for admin operations.

### Modified Capabilities

- `admin-console`: Login required before management UI.
- `docker-deployment`: Document `ADMIN_PASSWORD`.

## Impact

- `apps/api` middleware + auth routes
- `apps/admin` login gate + fetch wrapper
- `.env.example`, `scripts/smoke.sh`
