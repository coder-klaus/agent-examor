# platform-architecture

## Purpose

MIT greenfield monorepo (React web/admin, Hono API, PostgreSQL) separate from legacy Examor Vue/Python stack.

## Requirements

### Requirement: Greenfield monorepo layout

The project SHALL provide a MIT-licensed monorepo with `apps/web`, `apps/admin`, `apps/api`, and shared `packages/*` at the **repository root**, independent of legacy Examor `app/` and `server/` runtimes in any other repository.

#### Scenario: Developer clones repository

- **WHEN** a developer follows the Memor README in this repository
- **THEN** they can install dependencies and run web, admin, and api without starting legacy Examor docker compose services or cloning the Examor monorepo

### Requirement: Technology stack

The greenfield stack SHALL use React (Vite) for web and admin, Hono for API, Drizzle ORM with PostgreSQL, TypeScript throughout, and pnpm workspaces with Turborepo.

#### Scenario: API persists data

- **WHEN** the API starts with a valid `DATABASE_URL`
- **THEN** it connects to PostgreSQL and runs migrations
