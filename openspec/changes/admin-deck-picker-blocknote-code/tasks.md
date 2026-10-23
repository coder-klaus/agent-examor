## 1. BlockNote code blocks

- [x] 1.1 Add `@blocknote/code-block` to `packages/ui` and wire `syntaxHighlighter` + `createCodeBlockSpec(codeBlockOptions)` in `MarkdownEditor.tsx`
- [x] 1.2 Add package to admin Vite `optimizeDeps` if needed

## 2. Deck API

- [x] 2.1 Extend `POST /import/commit` for `deckId` vs `deckName` target modes
- [x] 2.2 Add `PATCH /decks/:deckId` (rename) and `DELETE /decks/:deckId`
- [x] 2.3 Scope topic/card insert to existing deck when appending

## 3. Admin UI

- [x] 3.1 Implement searchable `DeckCombobox` on import tab with default deck selection
- [x] 3.2 Enhance decks tab: create, rename, delete, search filter, sort toggle
- [x] 3.3 Wire preview/commit payloads to selected deck target

## 4. Verify

- [x] 4.1 Run `make check`; manual smoke: import append vs new deck, code block language in editor
