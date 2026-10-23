## Decisions

1. **POST `/decks/:deckId/cards`** — body `{ topic?, question, referenceAnswer }`; topic resolved like bulk import (find or create topic in deck).
2. **Shared helper** — `insertCardWithSchedule(deckId, { topic, question, referenceAnswer })` used by bulk import loop and single-card route.
3. **Deck target on add-card** — if combobox is "new deck", create deck via `POST /decks` once before first card in session or on each submit when still in new mode.
4. **Editors** — two `MarkdownEditor` instances with `minHeight` ~ `min(240px, 35dvh)` each.
5. **After success** — clear `question` and `referenceAnswer`; keep `topic` and deck selection; toast with session count.

## Non-Goals

- Edit/delete individual cards in UI (future).
- MCP single-card tool (future).
