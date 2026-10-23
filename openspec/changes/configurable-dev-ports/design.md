## Context

Monorepo 根目录已有 `.env`（API/DB）。Vite 子包需 `envDir` 指向仓库根以读取同一文件。

## Goals / Non-Goals

**Goals:** 单处配置端口；占用时失败明确而非静默换端口。

**Non-Goals:** 改 API `3000`、compose `5180/5181`、生产部署端口。

## Decisions

| 项 | 选择 |
|----|------|
| 默认 Web | 5273（避开 5173） |
| 默认 Admin | 5274 |
| 读取方式 | `loadEnv` + `envDir: repo root` |
| package.json dev | `vite`（无 `--port`） |
