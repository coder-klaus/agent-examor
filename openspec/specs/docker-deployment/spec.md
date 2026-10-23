# docker-deployment

## Purpose

Personal production deployment via Docker Compose (VPS / home server).

## Requirements

### Requirement: Docker Compose for personal production

The repository SHALL provide Docker Compose (or documented equivalent) to run PostgreSQL, API, web, and admin for personal online deployment.

#### Scenario: First deploy on a VPS

- **WHEN** an operator sets required environment variables and runs compose up
- **THEN** health checks pass and the learner web URL serves the application

### Requirement: Secrets via environment

The deployment SHALL require secrets (`DATABASE_URL`, encryption material, admin credentials) via environment or env files excluded from git, not baked into images.

#### Scenario: Image rebuild

- **WHEN** containers are rebuilt without changing env files
- **THEN** existing database volume retains user data and keys remain configured from env

### Requirement: Production-oriented defaults

The compose stack SHALL document exposed ports, optional reverse proxy/TLS, and backup of PostgreSQL volume for personal operations.

#### Scenario: Operator backs up data

- **WHEN** following deployment documentation
- **THEN** they can export DB volume or use MCP/API export in addition to infra backup
