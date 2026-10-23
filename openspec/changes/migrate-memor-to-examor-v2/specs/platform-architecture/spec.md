## MODIFIED Requirements

### Requirement: Greenfield monorepo layout

The project SHALL provide a MIT-licensed monorepo with `apps/web`, `apps/admin`, `apps/api`, and shared `packages/*` at the **repository root** of the standalone Memor repository (`examor-v2`), independent of legacy Examor `app/` and `server/` runtimes in any other repository.

#### Scenario: Developer clones repository

- **WHEN** a developer follows the Memor README in `examor-v2`
- **THEN** they can install dependencies and run web, admin, and api without starting legacy Examor docker compose services or cloning the Examor monorepo
