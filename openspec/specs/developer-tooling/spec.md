# developer-tooling

## Purpose

Stable command-line entrypoints for local development and light validation.

## Requirements

### Requirement: Documented Make entrypoints

The repository SHALL provide a root `Makefile` with at least `help`, `setup`, `dev`, `build`, `db-up`, `db-migrate`, `smoke`, and `down` targets that delegate to existing `pnpm`, Docker Compose, or `scripts/smoke.sh` without duplicating application logic.

#### Scenario: New developer onboards

- **WHEN** a developer runs `make help` at the repository root
- **THEN** they see descriptions of common targets including setup and dev

#### Scenario: One-command local bootstrap

- **WHEN** a developer runs `make setup` with Docker available
- **THEN** a local `.env` is created if missing, dependencies install, PostgreSQL starts, and migrations run

#### Scenario: Smoke test after API is up

- **WHEN** the API is reachable at the default base URL and the developer runs `make smoke`
- **THEN** `scripts/smoke.sh` executes successfully

### Requirement: Configurable Vite dev ports

The repository SHALL read learner and admin dev server ports from root environment variables `WEB_DEV_PORT` and `ADMIN_DEV_PORT` (documented in `.env.example`), with defaults that do not assume port `5173` is free.

#### Scenario: Developer overrides Web port

- **WHEN** `WEB_DEV_PORT` is set in root `.env` before `pnpm dev` or `make dev`
- **THEN** `apps/web` serves on that port and `strictPort` prevents silent port hopping
