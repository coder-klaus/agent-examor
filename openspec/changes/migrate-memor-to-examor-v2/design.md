## Context

Memor was implemented under `~/Desktop/examor/memor/` with OpenSpec in `examor/openspec/`, while the intended product workspace is `~/Desktop/examor-v2` (empty git repo with only env templates and Cursor OpenSpec skills). Greenfield feature work is complete in the old tree; this change is **re-homing** artifacts, not re-building features.

## Goals / Non-Goals

**Goals:**

- Copy monorepo files from `examor/memor/` → `examor-v2/` root (excluding `node_modules`, lockfile regenerated optional).
- Copy `examor/openspec/specs/*` → `examor-v2/openspec/specs/`.
- Set `openspec/config.yaml` context to Memor-only standalone repo.
- Root `README.md` + `LICENSE` (MIT) + `.env.example` aligned with migrated `memor` package.
- `.gitignore` covers Node, Turbo, Docker env, and `.pnpm-store`.

**Non-Goals:**

- Deleting `examor/memor/` automatically.
- Upstreaming changes to `codeacme17/examor`.
- New product features or schema changes.

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 迁移方式 | `rsync`/`cp` 保留目录结构，排除 `node_modules` | 最快、与已实现代码一致 |
| 包名 | 保持 `@memor/*` 与 `memor` root package | 避免无意义重命名 |
| OpenSpec | `openspec init` 已在 v2；本 change 补 specs 同步 | 规划根与代码根一致 |
| `.env` | 以 `memor/.env.example` 为准，合并 v2 已有变量名仅当兼容 | 减少配置漂移 |
| Legacy 指针 | 可选在 `examor/README` 加一句（本仓库外操作） | 非阻塞；任务可标为可选 |

## Risks / Trade-offs

- [Risk] 两处副本（`examor/memor` vs `examor-v2`）短期并存 → **Mitigation**：README 声明 v2 为 canonical；后续手动删旧目录。
- [Risk] 绝对路径或文档仍写 `memor/` 子路径 → **Mitigation**：迁移后全文搜索 `examor/memor` 并改 README/compose 注释。
- [Risk] `pnpm install` 路径变化 → **Mitigation**：在 v2 根目录重新 `pnpm install` 验证。

## Migration Plan

1. Copy tree → v2 root.
2. Copy OpenSpec main specs.
3. Update config + docs + gitignore.
4. `pnpm install` && `docker compose config` smoke.
5. Archive this change after sync specs delta (`/opsx:sync` or archive skill).

## Open Questions

- Remote origin URL for `examor-v2`（GitHub 新 repo 名是否仍叫 examor-v2 或 memor）— 不影响文件迁移。
