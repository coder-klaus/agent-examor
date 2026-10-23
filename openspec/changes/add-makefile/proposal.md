## Why

本地与部署相关命令分散在 `pnpm`、`docker compose` 和 `scripts/smoke.sh` 中，新贡献者需要拼凑 README 多段才能跑通。根目录 **Makefile** 提供稳定、可发现的入口（`make setup`、`make dev`、`make smoke`），不重复业务逻辑。

## What Changes

- 新增根目录 `Makefile`：薄封装 `pnpm`、Docker Compose、`scripts/smoke.sh`。
- 默认 `make` / `make help` 列出目标与简短说明。
- README「本地开发」优先展示 `make` 流程，保留等价 `pnpm` 命令作备选。

## Capabilities

### New Capabilities

- `developer-tooling`: 文档化的 Make 目标，覆盖安装、数据库、开发、构建、冒烟与 compose 生命周期。

### Modified Capabilities

（无）

## Impact

- 根目录 `Makefile`、`README.md`
- 无运行时 API 或依赖变更；Windows 用户仍可直接使用 `pnpm`/`docker`
