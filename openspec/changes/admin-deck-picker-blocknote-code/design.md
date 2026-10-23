## Context

`POST /import/commit` always `INSERT`s a new row in `decks`. Admin loads `GET /decks` but import uses isolated `deckName` state defaulting to `默认牌组`. `MarkdownEditor` uses default BlockNote schema plus math blocks only.

## Goals / Non-Goals

**Goals:**

- Combobox deck target on import with fuzzy match on deck names (client-side).
- Commit either merges cards into `deckId` or creates a new deck once per commit.
- Decks tab: CRUD basics and sorted/filtered list.
- BlockNote editing: Shiki highlight + language selector on code blocks.

**Non-Goals:**

- Drag-and-drop manual deck ordering in DB (use name/date sort in UI).
- Web learner deck picker (can follow later).
- Per-card deck editor or bulk move between decks.

## Decisions

1. **Commit API shape** — `z.union` or object with `mode: 'existing' | 'new'`: `{ batchId, deckId }` OR `{ batchId, deckName }`. Reject if both/neither. MCP uses same contract.
2. **Append semantics** — New cards/topics inserted under existing `deckId`; topics matched by name within that deck (same as today’s per-import topic map, scoped to deck).
3. **DeckCombobox** — Headless combobox in `@memor/ui` or `apps/admin/components`: input filters `decks`, Enter/select sets `deckId`; “新建「…」” calls `POST /decks` then selects. Initial value: first deck where `name === '默认牌组'`, else first deck by name, else prompt create.
4. **BlockNote** — Add `@blocknote/code-block`; extend schema `codeBlock: createCodeBlockSpec(codeBlockOptions)`; `extensions: [syntaxHighlighter]`; add to admin Vite `optimizeDeps`.
5. **Delete deck** — `DELETE /decks/:id` with cascade (schema already cascades cards).

## Risks / Trade-offs

- **[Risk] Breaking MCP clients sending only `deckName`** → Mitigation: accept legacy `deckName`-only as `create new deck` for one release; document in API.
- **[Risk] Admin bundle size** → Mitigation: code-block package only loaded with admin editor chunk if needed later; v1 accept size on admin only.

## Migration Plan

No data migration. Operators may have duplicate “默认牌组” decks from old behavior; manual merge/delete in decks tab.

## Open Questions

- Whether preview should display resolved target deck name from `deckId`.
