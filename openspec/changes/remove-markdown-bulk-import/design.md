## Context

批量导入链路：

```
Admin Tab / REST          MCP import_preview
        │                        │
        └──────────┬─────────────┘
                   ▼
        parseImportMarkdown (### Q / ### A)
                   ▼
        import_batches → commit → cards
```

单卡写入已存在：`POST /decks/:deckId/cards`（Admin「添加卡片」在用）。

## Goals / Non-Goals

**Goals:**

- 端到端删除 MD 拆分导入（UI、REST、MCP、解析器、batch 表）。
- Smoke 与规格与现网行为一致。
- API Key 不再展示或签发 `import` scope。

**Non-Goals:**

- 实现 MCP 批量建卡（后续 change）。
- 删除 JSON `export_backup`。
- 改卡片字段 Markdown 渲染/编辑（BlockNote / Streamdown 不变）。

## Decisions

1. **硬删除 API** — `import/preview` 与 `import/commit` 返回 404 或路由移除；不保留兼容层。

2. **`import_batches` 表** — 新增 Drizzle 迁移 `DROP TABLE import_batches`；历史 batch 数据可丢弃（个人部署、无生产 SLA）。

3. **`ApiScope`** — 从联合类型移除 `'import'`；已存 key 若含 `import` 在 DB 仍可读，中间件忽略无效 scope 或迁移脚本剔除（实现时：签发不再含 import；读取 scopes 时 filter 未知值）。

4. **Smoke** — 创建临时 deck + 一张卡，再测 MCP `export_backup`，key scopes `cards:read,cards:write,export`（或最小 `cards:read,export`）。

5. **Admin 清理** — 移除 `FileUp` 导航项；删除仅用于 bulk-import 的 `markdown`/`batchId`/`preview`/`runPreview`/`commit`；`DeckCombobox` 保留在「添加卡片」。

## Risks / Trade-offs

- **[Risk]** 已有文档/脚本依赖 `### Q` / `### A` 导入 → **Mitigation**: `docs/memor-markdown-profile.md` 注明退役；export JSON 作备份路径。
- **[Risk]** AI 工作流只剩 list + export，不能写 → **Mitigation**: proposal 标明 follow-up `mcp-card-write`；短期可用 REST 单卡 API + 人工 Admin。

## Migration Plan

1. 部署 API + Admin 同版本。
2. 无用户数据迁移要求；`import_batches` 表删除。
3. 轮换 MCP key，去掉 `import` scope。

## Open Questions

- 是否在同一 change 内加最小 MCP `card_create`？**建议否**，保持删除变更聚焦；你若希望一并做，可在 apply 前改 `tasks.md`。
