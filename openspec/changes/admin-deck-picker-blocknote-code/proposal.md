## Why

Admin import still uses a free-text deck name and always creates a new deck on commit, which duplicates names and does not match operator expectations for choosing an existing deck. The BlockNote import editor lacks Shiki syntax highlighting and a language picker on code blocks because `@blocknote/code-block` was not enabled. Deck management is read-only in the UI despite existing list/create APIs.

## What Changes

- Enable BlockNote code blocks with `@blocknote/code-block` (`syntaxHighlighter` + `createCodeBlockSpec(codeBlockOptions)`).
- Replace import deck name text field with a searchable combobox: select existing deck, fuzzy filter, or create a new deck by name.
- Import commit SHALL support **append to existing deck** (`deckId`) or **create new deck** (`deckName`); default selection prefers an existing deck named like “默认牌组” when present.
- Decks tab: create deck, rename, delete (with confirm), client-side search filter, and sort by name or created date.
- API: extend `POST /import/commit`; add `PATCH` and `DELETE` for decks; optional `GET /decks` query `q` for server-side filter later (v1 can be client-only search).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `design-system`: `MarkdownEditor` SHALL support highlighted code blocks with selectable languages via BlockNote code-block package.
- `admin-console`: Import and deck management UX as above.
- `card-import`: Commit phase SHALL attach cards to an existing deck when `deckId` is provided, or create a deck when `createDeck` + `deckName` is provided.

## Impact

- `packages/ui` (`MarkdownEditor.tsx`, optional `DeckCombobox` in ui or admin-local)
- `apps/admin/src/App.tsx`
- `apps/api/src/routes/v1.ts`, possible `decks` schema if sort metadata added (defer `sortOrder` column unless needed)
- MCP/import commit payloads if shared with admin
