## ADDED Requirements

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
