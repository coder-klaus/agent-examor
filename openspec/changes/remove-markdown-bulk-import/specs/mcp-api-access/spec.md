## MODIFIED Requirements

### Requirement: MCP deck and card CRUD

The MCP server SHALL provide tools for listing decks and cards. Card write tools MAY be added later; bulk Markdown import is not part of MCP.

#### Scenario: AI lists cards in a deck

- **WHEN** a client with `cards:read` calls `card_list` with a valid `deckId`
- **THEN** the response contains cards for that deck

### Requirement: MCP import and export

The MCP server SHALL provide a tool for full or partial export backup in a documented JSON format without secrets. The MCP server SHALL NOT provide Markdown import preview or commit tools.

#### Scenario: AI exports backup

- **WHEN** a client with `export` scope requests a backup
- **THEN** the response contains decks, cards, and review state without API keys or LLM secrets
