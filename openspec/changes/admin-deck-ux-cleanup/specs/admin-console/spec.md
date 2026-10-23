## MODIFIED Requirements

### Requirement: Deck management in admin

The admin decks tab SHALL support creating a deck via a primary **新建牌组** action that opens a modal dialog (name field, cancel and confirm), renaming a deck, deleting a deck (with confirmation), and filtering the list by deck name substring (case-insensitive). The list SHALL be ordered by deck name using locale-aware comparison (`zh-CN`). The UI SHALL NOT display internal numeric deck IDs to the operator.

#### Scenario: Operator creates a deck from modal

- **WHEN** the operator clicks **新建牌组**, enters a name, and confirms
- **THEN** the deck is created via the API, the modal closes, and the list refreshes with the new deck visible

#### Scenario: Operator filters by name

- **WHEN** the operator types text in the deck search field
- **THEN** only decks whose names contain the query (case-insensitive) are shown

#### Scenario: Operator renames a deck

- **WHEN** the operator saves a new name for a deck
- **THEN** the list reflects the new name after refresh

#### Scenario: Operator deletes confirmed deck

- **WHEN** the operator confirms deletion
- **THEN** the deck and its cards are removed per API cascade rules

#### Scenario: Deck list hides internal id

- **WHEN** the operator views the deck list
- **THEN** each row shows the deck name and actions but not a `#id` or similar internal identifier
