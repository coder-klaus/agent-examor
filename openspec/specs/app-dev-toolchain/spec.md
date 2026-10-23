# app-dev-toolchain

## Purpose

Legacy Examor `app/` pnpm 10 toolchain for Docker builds (see change `upgrade-app-pnpm`).

## Requirements

### Requirement: Pinned pnpm for app

The `app` package SHALL declare `packageManager` with a specific pnpm 10.x version so Corepack resolves the same toolchain locally and in Docker.

#### Scenario: Developer installs dependencies

- **WHEN** a developer runs `corepack enable` and `pnpm install` in `app/`
- **THEN** the pnpm version matches `packageManager` in `app/package.json`

### Requirement: Allowed dependency build scripts

The `app` package SHALL list required postinstall/build dependencies in `pnpm.onlyBuiltDependencies` so install succeeds under pnpm strict build policy.

#### Scenario: Docker app image build

- **WHEN** the `app` Docker image runs `pnpm install --frozen-lockfile`
- **THEN** install completes without `ERR_PNPM_IGNORED_BUILDS`

### Requirement: Docker uses Corepack

The `app` Dockerfile SHALL enable Corepack and use the pinned pnpm from `package.json` instead of `npm install -g pnpm`.

#### Scenario: Compose build frontend

- **WHEN** `docker compose build app` runs
- **THEN** dependency installation uses Corepack-managed pnpm and the committed lockfile
