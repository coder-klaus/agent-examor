## Why

Admin 主路径已是「添加卡片」（Q/A 双编辑器）；基于 `### Q` / `### A` 的 **Markdown 批量拆分导入** 与 MCP 的 `import_preview` 重复且维护成本高，还容易与「选牌组 / 新建牌组」流程纠缠。批量内容由 AI 经 MCP 直接写卡片更合适，而非保留一套专用 MD 方言与两阶段 preview/commit。

## What Changes

- 移除 Admin **批量导入** Tab 及全部相关状态（预览、commit、`DeckCombobox` 仅用于导入的路径等）。
- 移除 REST **`POST /api/v1/import/preview`** 与 **`POST /api/v1/import/commit`**。
- 删除 **`parseImportMarkdown`** 服务及 `import_batches` 持久化（新迁移删除表或停止写入并删代码引用）。
- 移除 MCP 工具 **`import_preview`**；从 API Key **`import` scope** 中退役（`@memor/shared`、签发 UI、文档）。
- 更新 **`scripts/smoke.sh`**：用 `POST /decks` + `POST /decks/:deckId/cards` 验证 API。
- 更新 **`docs/memor-markdown-profile.md`**：去掉「导入文件格式」专节，保留单卡字段 Markdown 说明。
- **不**删除 `export_backup`、单卡 CRUD、BlockNote 编辑器（仍用于 Q/A 字段）。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `admin-console`: 去掉批量导入 UI 与相关需求；桌面主流程以添加卡片与牌组管理为准。
- `card-import`: **整能力退役**（见 delta `REMOVED`）。
- `mcp-api-access`: 去掉 MCP 导入工具与 `import` scope 要求。

## Impact

- `apps/admin/src/App.tsx`
- `apps/api/src/routes/v1.ts`, `apps/api/src/index.ts`, `apps/api/src/services/import-markdown.ts`（删除）
- `apps/api/src/db/schema.ts` + 新 Drizzle SQL 迁移
- `packages/shared` (`ApiScope`)
- `scripts/smoke.sh`, `docs/memor-markdown-profile.md`
- OpenSpec 主规格 `openspec/specs/*` 在 archive 时同步

**Follow-up（本变更不实现）**：MCP `card_create` / 批量写卡，替代 AI 侧「贴一大段 MD 再 import」——可单独开 change。
