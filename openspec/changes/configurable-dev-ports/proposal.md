## Why

本机其他服务已占用 Vite 默认 `5173`，Memor Web 开发服无法启动。端口硬编码在 `package.json` 不便个人调整。

## What Changes

- 根目录 `.env` / `.env.example` 增加 `WEB_DEV_PORT`、`ADMIN_DEV_PORT`（默认 `5273` / `5274`）。
- `apps/web` 与 `apps/admin` 的 Vite `server.port` 从环境变量读取，`strictPort: true`。
- 更新 README 与 `developer-tooling` 规格说明。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `developer-tooling`: 文档化可配置开发端口及默认值。

## Impact

- `apps/web`、`apps/admin` Vite 配置；`.env.example`；README
