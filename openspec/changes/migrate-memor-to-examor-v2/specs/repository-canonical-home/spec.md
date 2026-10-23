# repository-canonical-home

## ADDED Requirements

### Requirement: Standalone Memor repository root

The Memor product SHALL live in the `examor-v2` git repository with the monorepo at the repository root (`apps/`, `packages/`, root `docker-compose.yml`, root `package.json`), not as a nested folder inside the legacy Examor repository.

#### Scenario: Developer opens Cursor workspace

- **WHEN** a developer opens the `examor-v2` workspace
- **THEN** OpenSpec planning, `pnpm` scripts, and Docker Compose targets resolve without referencing a parent `examor/` path

### Requirement: OpenSpec source of truth

The `examor-v2/openspec/specs/` directory SHALL contain the normative product capabilities for Memor (copied or synced from the completed greenfield work) and SHALL be the only specs tree used for new changes after migration.

#### Scenario: New OpenSpec change

- **WHEN** a contributor runs `openspec new change` in `examor-v2`
- **THEN** `openspec list` and artifact paths resolve under `examor-v2/openspec/` without errors

### Requirement: Legacy Examor boundary

The `examor-v2` repository SHALL NOT include legacy Examor AGPL application source (`app/`, `server/`) and SHALL document that legacy Examor remains a separate repository for reference only.

#### Scenario: License review

- **WHEN** a reviewer inspects the repository root
- **THEN** they find MIT license for Memor code and no mixed AGPL runtime dependencies in the monorepo
