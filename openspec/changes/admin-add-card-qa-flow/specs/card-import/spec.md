## ADDED Requirements

### Requirement: Single-card create API

The API SHALL accept `POST /decks/:deckId/cards` with `question` and `referenceAnswer` strings and optional `topic` name, creating the card and initial FSRS review state in the given deck.

#### Scenario: Valid single card

- **WHEN** the client posts non-empty question and reference answer for an existing deck
- **THEN** the API returns the created card id and the card appears in review queues per scheduler rules

#### Scenario: Unknown deck

- **WHEN** the deck id does not exist
- **THEN** the API responds with not found and does not create a card
