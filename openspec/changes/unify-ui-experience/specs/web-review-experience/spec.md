## ADDED Requirements

### Requirement: Session queue visibility

The learner UI SHALL display the current mode (today vs practice) and remaining cards in the active session (or an explicit empty state when zero).

#### Scenario: Active session with cards

- **WHEN** the queue has multiple cards
- **THEN** the UI shows how many remain before the current card

### Requirement: Structured grading feedback

After grading, the UI SHALL present score, standard answer, mistakes, and improvements in distinct visual sections rather than a single unstructured text block.

#### Scenario: Grading completes

- **WHEN** the grade API returns structured fields
- **THEN** each field is labeled and grouped in separate panels or lists

### Requirement: Markdown question rendering

Card questions SHALL be rendered as Markdown when shown to the learner.

#### Scenario: Question contains Markdown

- **WHEN** a card question includes Markdown syntax
- **THEN** the learner sees formatted content (e.g. lists, code) without raw syntax markers dominating the layout
