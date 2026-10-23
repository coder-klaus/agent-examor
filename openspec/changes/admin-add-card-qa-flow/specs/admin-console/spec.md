## ADDED Requirements

### Requirement: Per-card Q/A authoring

The admin SHALL provide a primary flow to add one card at a time with separate rich-text editors for the question and reference answer, an optional topic field, deck selection, and a confirm action that persists the card immediately without a batch preview step.

#### Scenario: Operator adds a card

- **WHEN** the operator fills question and answer and confirms
- **THEN** a new card is stored in the selected deck and the question and answer fields are cleared for the next entry

#### Scenario: Operator continues adding

- **WHEN** the operator confirms multiple times in one session
- **THEN** each confirmation creates a distinct card in the same deck unless the operator changes deck

### Requirement: Bulk Markdown import as secondary flow

Bulk Markdown import with preview and commit SHALL remain available under a separate admin navigation entry distinct from per-card authoring.

#### Scenario: Operator bulk imports

- **WHEN** the operator opens the bulk import section
- **THEN** they can paste or edit a Markdown document with `### Q` / `### A` pairs and use preview and commit as today
