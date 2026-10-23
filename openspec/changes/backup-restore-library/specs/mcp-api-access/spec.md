## MODIFIED Requirements

### Requirement: MCP import and export

The MCP server SHALL provide `export_backup` with optional `deckId` and `topicId` arguments for scoped export, and `import_library_restore` for library-targeted restore using the same JSON schema as HTTP import. Restore SHALL require `cards:write` scope.

#### Scenario: AI restores a library

- **WHEN** a client with `cards:write` calls `import_library_restore` with backup payload and source/target coordinates
- **THEN** cards are created on the target deck and library per server rules
