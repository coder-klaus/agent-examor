## REMOVED Requirements

### Requirement: Preprocessed Q/A import

**Reason**: Bulk Markdown `### Q` / `### A` import is retired; operators add cards via Admin Q/A flow and future MCP write tools.

**Migration**: Use `POST /decks/:deckId/cards` for single cards; use `export_backup` JSON for backup/restore patterns until a documented MCP write path exists.

### Requirement: Import preview and commit

**Reason**: Two-phase import batches are removed with the parser and `import_batches` storage.

**Migration**: No preview/commit endpoints; do not rely on `batchId` workflows.
