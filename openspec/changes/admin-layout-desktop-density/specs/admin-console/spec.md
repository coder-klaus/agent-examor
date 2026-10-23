## ADDED Requirements

### Requirement: Wide-viewport admin workspace

On viewports at least `lg` width, primary admin task surfaces (import, deck list, LLM and API key settings) SHALL expand to use the main content column up to a documented maximum width (approximately 1440px), rather than remaining in a narrow centered column with large unused side margins.

#### Scenario: Operator uses import on a desktop monitor

- **WHEN** the viewport is wide and the import tab is active
- **THEN** the Markdown editor and preview occupy most of the horizontal space in the main column

#### Scenario: Operator uses decks tab on desktop

- **WHEN** the decks tab is shown on a wide viewport
- **THEN** the deck list and controls span the admin content shell width

### Requirement: Import editor vertical space

The import tab SHALL provide a Markdown editor whose visible editing area uses substantial viewport height (at least roughly 60% of the viewport height on desktop) so block editing is comfortable.

#### Scenario: Desktop import session

- **WHEN** the operator opens the import tab on a tall display
- **THEN** the BlockNote editing region is visibly taller than a single short form field
