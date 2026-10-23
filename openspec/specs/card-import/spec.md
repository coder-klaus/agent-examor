# card-import

## Purpose

Import user-preprocessed Markdown Q/A into decks and cards without LLM question generation.

## Requirements

### Requirement: Preprocessed Q/A import

The system SHALL import learning cards from user-preprocessed Markdown (question + reference answer per card) without LLM-based question generation from raw notes.

#### Scenario: Valid import file

- **WHEN** admin or MCP submits Markdown matching the documented format
- **THEN** cards are created with `question` and `reference_answer` linked to a deck and optional topic

#### Scenario: Invalid import file

- **WHEN** import preview detects missing answers or malformed blocks
- **THEN** the system returns errors with line references and does not commit partial cards

### Requirement: Import preview and commit

The system SHALL support a two-phase import: preview (validation only) and commit (transactional write).

#### Scenario: MCP import workflow

- **WHEN** an AI client calls import preview then commit with a valid batch
- **THEN** the same validation rules apply as the admin UI import
