## ADDED Requirements

### Requirement: Scoped backup export

The system SHALL export `schemaVersion: 1` JSON compatible with full backup format, optionally filtered to a single deck and optional topic (library).

#### Scenario: Export one library

- **WHEN** client requests export with `deckId` and `topicId`
- **THEN** the response contains only cards in that deck and topic plus related topics/decks metadata needed to interpret the file

### Requirement: Library-targeted restore

The system SHALL restore cards from a backup file into a specified target deck and target topic (library), mapping source `(deckId, topicId)` coordinates in the file to new database IDs without reusing source card IDs.

#### Scenario: Restore into named library

- **WHEN** client posts a valid backup and source/target deck and library coordinates
- **THEN** new cards are created under the target deck and topic and optional review states are attached to the new card IDs
