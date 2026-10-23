## 1. API & data

- [x] 1.1 Remove `import/preview` and `import/commit` routes and helpers from `v1.ts`
- [x] 1.2 Delete `import-markdown.ts`; drop `import_batches` from schema + add SQL migration
- [x] 1.3 Remove MCP `import_preview`; update `/mcp/tools` list

## 2. Shared & keys

- [x] 2.1 Remove `import` from `ApiScope` in `@memor/shared` and all zod enums / admin key defaults

## 3. Admin UI

- [x] 3.1 Remove **批量导入** tab, nav item, and all bulk-import state/handlers from `App.tsx`

## 4. Docs & smoke

- [x] 4.1 Update `docs/memor-markdown-profile.md` (drop bulk import file format)
- [x] 4.2 Rewrite `scripts/smoke.sh` to create deck + card without import endpoints

## 5. Verification

- [x] 5.1 Run `make check`
