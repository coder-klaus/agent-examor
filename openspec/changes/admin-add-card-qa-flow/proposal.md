## Why

Operators expect to add flashcards one at a time with separate question and answer editors, confirm, then continue—not to author a single Markdown document with `### Q` / `### A` headings. The admin UI currently centers bulk Markdown import, which mismatches the mental model of Q/A card creation.

## What Changes

- Add `POST /api/v1/decks/:deckId/cards` to create one card (optional topic, question, reference answer) with FSRS initial state.
- New primary admin tab **添加卡片**: deck target, optional topic, two BlockNote/Markdown editors (Q and A), **确认添加** clears Q/A and allows the next card; session counter of cards added.
- Rename/move bulk flow to **批量导入** (Markdown) as secondary tab; behavior unchanged.

## Capabilities

### Modified Capabilities

- `admin-console`: Primary content authoring SHALL be per-card Q/A entry; bulk Markdown import remains available as a separate flow.
- `card-import`: ADDED requirement for direct single-card creation API (delta spec).

## Impact

- `apps/api/src/routes/v1.ts`
- `apps/admin/src/App.tsx`
