## Decisions

1. **库 = `topics` row** under a deck; identity for restore is `(deckId, topicId)` with `topicId: null` for uncategorized cards in that deck.
2. **No stable UUID columns in v1** — backup file uses numeric ids only as **source coordinates**; server always inserts new rows on target.
3. **Default `includeReviewStates: true`** when present in backup; missing state → new card schedule via `insertCardWithSchedule`.
4. **Append-only merge** — restore adds cards; does not delete existing target library cards (personal use).
5. **Topic on target** — resolve `target.topicId`, or `target.topicName`, or copy name from backup `topics` for `source.topicId`.

## API sketch

```json
POST /import/library-restore
{
  "backup": { "schemaVersion": 1, "decks": [], "topics": [], "cards": [], "reviewStates": [] },
  "source": { "deckId": 1, "topicId": 3 },
  "target": { "deckId": 2, "topicName": "极限" },
  "includeReviewStates": true
}
```

## Risks

- Duplicate Q/A on repeated import → acceptable for personal use; document append behavior.
