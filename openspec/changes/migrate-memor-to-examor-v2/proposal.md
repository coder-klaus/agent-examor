## Why

Memor 的实现与 OpenSpec 落在 `~/Desktop/examor`（`memor/` 子目录），而 Cursor 工作区与独立 git 仓库是 `examor-v2`，导致规划、实现与日常开发目录不一致，容易重复脚手架或改错路径。需要将 **Memor monorepo + 主规格** 迁入 `examor-v2`，作为 **唯一 MIT 产品仓库**。

## What Changes

- 将 `examor/memor/` 的 monorepo（`apps/*`、`packages/*`、`docker-compose`、脚本）迁到 **`examor-v2` 仓库根**（或等价顶层布局），不再依赖「嵌在 Examor 仓库内」。
- 从 `examor/openspec/specs/` **同步** 已完成的 greenfield 能力规格到 `examor-v2/openspec/specs/`（内容等价，路径以本仓库为准）。
- 更新 `openspec/config.yaml` 项目上下文：本仓库 **仅 Memor**，无 legacy Examor 运行时义务。
- 合并/对齐根目录 `README.md`、`LICENSE`（MIT）、`.env.example`、`.gitignore`（排除 `node_modules`、`.pnpm-store` 等）。
- 在 `examor` 侧 README 增加 **指针**（Memor 已迁至独立仓库），避免后续继续在 `memor/` 下开发（文档级，不强制改 upstream）。
- **Non-goals**：不迁移 Examor AGPL 的 `app/`、`server/`；不在此 change 内做新功能；不删除 `examor` 上已有目录（除非用户后续手动清理）。

## Capabilities

### New Capabilities

- `repository-canonical-home`: `examor-v2` 作为 Memor 唯一源码与 OpenSpec 规划根；目录约定、与 legacy Examor 的关系、许可边界。

### Modified Capabilities

- `platform-architecture`: 由「Examor 仓库内 `memor/` 子 monorepo」改为「独立仓库根 monorepo」；legacy 边界表述更新。

## Impact

- `examor-v2`：新增完整 monorepo 与 `openspec/specs/*`；更新文档与忽略规则。
- 开发流程：OpenSpec change、`pnpm`/`docker compose` 均在 `examor-v2` 执行。
- `examor`：可选 README 指针；`memor/` 可能成为陈旧副本（需团队约定是否删除）。
