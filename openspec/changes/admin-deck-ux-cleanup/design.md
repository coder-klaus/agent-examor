## Context

The decks tab in `apps/admin/src/App.tsx` uses a second inline text field for creation, sort toggle buttons, and `#{d.id}` in each row. `@memor/ui` has `Button`, `Card`, etc., but no shared modal yet.

## Goals / Non-Goals

**Goals:**

- Toolbar: name search + **新建牌组** button.
- Modal-based create with validation (non-empty name) and existing `POST /decks` flow.
- List sorted by name only; remove sort UI and `deckSort` state.
- Remove `#id` from list rows.

**Non-Goals:**

- Removing the **批量导入** tab or MCP/import API changes.
- Replacing DeckCombobox “create new” inline flow on the add-card tab.
- Replacing `confirm()` for delete with a styled dialog (future polish).

## Decisions

1. **`Modal` in `@memor/ui`** — Implement with native `<dialog>` + backdrop click / Escape to close, matching existing CSS variables (`border`, `radius`, `background`). Props: `open`, `onClose`, `title`, `children`, optional `footer` slot or compose in admin.

2. **Create flow** — Move `newDeckName` state to modal-local or reset on open; on success call existing `createDeck` logic, close modal, toast.

3. **Sorting** — Drop `deckSort` state; `visibleDecks` always `localeCompare('zh-CN')` after filter.

4. **Accessibility** — `dialog` element with `aria-labelledby` on title; focus name input when modal opens.

## Risks / Trade-offs

- **[Risk]** Operators who relied on “sort by created time” lose that UI → **Mitigation**: name sort covers typical use; creation order rarely needed for small personal libraries.

- **[Risk]** Duplicate modal patterns later → **Mitigation**: export `Modal` from `@memor/ui` now.

## Migration Plan

Deploy with admin UI only; no data migration.

## Open Questions

- None for this slice.
