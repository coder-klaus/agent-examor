## Why

`export_backup` exists but there is no symmetric restore. Operators need to move or merge **one library (topic) under a deck** using the same JSON format, targeting an explicit `(targetDeckId, targetTopic)` without reusing stale serial IDs from another database.

## What Changes

- **Scoped export:** `GET /export/backup?deckId=&topicId=` (topic optional) returns `schemaVersion: 1` JSON subset.
- **Library restore:** `POST /import/library-restore` accepts full or scoped backup + `source` `{ deckId, topicId }` (from file coordinates) + `target` `{ deckId, topicId? | topicName? }`; remaps card IDs and optionally FSRS `reviewStates`.
- **MCP:** `import_library_restore` (requires `cards:write`) and scoped `export_backup` query args.
- **Admin:** **备份** tab — pick deck + 库 (topic), export download; import file + target deck/库.

## Capabilities

### New Capabilities

- `backup-restore`: Scoped JSON export and library-targeted restore.

### Modified Capabilities

- `mcp-api-access`: Restore tool; export may accept scope parameters.
- `admin-console`: Backup UI.

## Impact

- `apps/api` service + routes, `apps/api/src/index.ts` MCP
- `apps/admin/src/App.tsx`
- `scripts/smoke.sh` optional extension
