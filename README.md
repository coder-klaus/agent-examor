# Memor

MIT 许可的间隔复习产品：**预处理 Markdown 题库** + **FSRS** + **OpenAI 兼容阅卷** + **MCP/API Key**。

本仓库为 **Memor 唯一源码与 OpenSpec 规划根**。原在 [Examor](https://github.com/codeacme17/examor) 仓库内 `memor/` 子目录的实现已迁至此处；legacy Examor（AGPL）不在本仓库中。

## 本地开发

```bash
make setup   # .env + pnpm install + Postgres + migrate
make dev
```

等价命令：`cp .env.example .env` → `pnpm install` → `docker compose up -d postgres` → `pnpm db:migrate` → `pnpm dev`。更多目标：`make help`（含 `make smoke`、`make check`）。

| 服务 | 地址 |
|------|------|
| API | http://localhost:3000 |
| Web | http://localhost:5273（`WEB_DEV_PORT`，根目录 `.env`） |
| Admin | http://localhost:5274（`ADMIN_DEV_PORT`） |

## 生产（个人 VPS）

```bash
docker compose up -d postgres api
# 构建静态资源后挂载到 nginx（见 deploy/）
pnpm build
```

## MCP

`POST /mcp/invoke`（`Authorization: Bearer <api_key>`），工具列表见 `GET /mcp/tools`。

## 规格

见 `openspec/specs/`。
