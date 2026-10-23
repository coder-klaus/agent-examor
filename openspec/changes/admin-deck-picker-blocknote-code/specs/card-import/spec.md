## MODIFIED Requirements

### Requirement: Import preview and commit

The system SHALL support a two-phase import: preview (validation only) and commit (transactional write). Commit SHALL accept either an existing `deckId` to append cards to that deck, or a `deckName` to create a new deck and attach cards to it. Exactly one target mode SHALL be required per commit.

#### Scenario: MCP import workflow

- **WHEN** an AI client calls import preview then commit with a valid batch
- **THEN** the same validation rules apply as the admin UI import

#### Scenario: Commit to existing deck

- **WHEN** commit is called with a valid `batchId` and `deckId`
- **THEN** parsed cards are inserted into that deck and no new deck row is created

#### Scenario: Commit creating new deck

- **WHEN** commit is called with a valid `batchId` and `deckName` (without `deckId`)
- **THEN** a new deck is created with that name and cards are inserted into it
