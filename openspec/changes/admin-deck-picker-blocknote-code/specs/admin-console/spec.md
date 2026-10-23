## ADDED Requirements

### Requirement: Deck target combobox on import

The admin import flow SHALL let the operator choose an existing deck or create a new deck via a searchable combobox (type-to-filter deck names) instead of a plain text field alone.

#### Scenario: Operator filters decks

- **WHEN** the operator types characters in the deck combobox
- **THEN** the list shows decks whose names fuzzy-match the query

#### Scenario: Operator selects existing deck

- **WHEN** the operator selects a deck from the list and commits import
- **THEN** new cards are added to that deck without creating a duplicate deck row

#### Scenario: Operator creates deck from combobox

- **WHEN** the operator chooses to create a new deck with a given name
- **THEN** the deck is created (if needed) and selected as the import target

### Requirement: Deck management in admin

The admin decks tab SHALL support creating a deck, renaming a deck, deleting a deck (with confirmation), searching deck names, and sorting the list by name or creation time.

#### Scenario: Operator renames a deck

- **WHEN** the operator saves a new name for a deck
- **THEN** the list reflects the new name after refresh

#### Scenario: Operator deletes empty or confirmed deck

- **WHEN** the operator confirms deletion
- **THEN** the deck and its cards are removed per API cascade rules

## MODIFIED Requirements

### Requirement: Rich Markdown import editor

The admin import flow SHALL provide block-based WYSIWYG editing (BlockNote) for deck import content, storing plain Markdown compatible with existing `### Q` / `### A` import rules. Code blocks in the editor SHALL support syntax highlighting and language selection.

#### Scenario: Operator edits import markdown

- **WHEN** the operator uses the import tab
- **THEN** they can add and rearrange blocks with slash commands and formatting controls typical of Notion-style editors, including highlighted code blocks
