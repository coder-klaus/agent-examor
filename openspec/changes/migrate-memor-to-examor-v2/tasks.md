## 1. Copy monorepo

- [x] 1.1 Copy `examor/memor/` to `examor-v2` repository root (exclude `node_modules`)
- [x] 1.2 Ensure root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `apps/`, `packages/`, `deploy/`, `docker-compose.yml` exist

## 2. OpenSpec and docs

- [x] 2.1 Copy `examor/openspec/specs/*` to `examor-v2/openspec/specs/`
- [x] 2.2 Update `openspec/config.yaml` with Memor standalone project context
- [x] 2.3 Add root `README.md` and `LICENSE` (MIT) from migrated memor tree; note legacy Examor is separate

## 3. Tooling hygiene

- [x] 3.1 Update `.gitignore` for Node, Turbo, `.env`, `.pnpm-store`, build outputs
- [x] 3.2 Align `.env.example` with API/docker expectations (prefer memor template)

## 4. Verification

- [x] 4.1 Run `pnpm install` at repository root
- [x] 4.2 Run `docker compose config` (or equivalent) to validate compose file
