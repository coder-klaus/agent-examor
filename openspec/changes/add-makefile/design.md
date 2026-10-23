## Context

Monorepo 已用 pnpm + Turborepo；Postgres 通过 `docker compose`；E2E 冒烟在 `scripts/smoke.sh`。无 CI Makefile 先例。

## Goals / Non-Goals

**Goals:**

- 薄封装；变量 `PNPM`、`COMPOSE`、`BASE` 可覆盖。
- `setup`: `cp -n .env.example .env` → `pnpm install` → `docker compose up -d postgres` → 等待健康 → `pnpm db:migrate`。
- `help` 用 `##` 注释 + `awk` 模式（POSIX make）。

**Non-Goals:**

- 替代 Turbo 任务图；不新增 npm scripts。
- Windows `nmake` 支持；不把 smoke 逻辑搬进 Makefile。

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 默认目标 | `help` | 避免误 `make` 跑长任务 |
| migrate 等待 | `depends_on` 健康检查 + 短 sleep 或 `pg_isready` via compose exec | 减少 migrate 竞态 |
| `api-docker` | 独立目标 `compose up -d postgres api` | 不跑前端时用 API 容器 |
| `check` | `pnpm build` + `docker compose config` | 轻量 CI 本地复现 |

## Risks / Trade-offs

- [Risk] `make setup` 在无 Docker 时失败 → **Mitigation**: help 文案注明依赖；失败时打印提示。
