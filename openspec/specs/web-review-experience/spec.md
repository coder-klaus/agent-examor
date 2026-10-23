# web-review-experience

## Purpose

Mobile-first learner SPA for scheduled and practice review.

## Requirements

### Requirement: Responsive learner UI

The `apps/web` application SHALL be mobile-first and responsive for review flows (today queue, practice, answer submission, grading feedback).

#### Scenario: Mobile review session

- **WHEN** the learner uses a phone-width viewport
- **THEN** question, answer input, and submit actions remain usable without horizontal scroll

### Requirement: Review session flow

The web app SHALL guide the learner through answering a card, displaying grading output (score, standard answer, mistakes, improvements), then advancing to the next card in the session.

#### Scenario: Complete one card in today queue

- **WHEN** grading completes successfully
- **THEN** the UI shows feedback and offers continue to the next due card

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

### Requirement: Rich Markdown rendering for cards

The learner UI SHALL render card questions and reference answers with GFM, syntax-highlighted fenced code, inline and block math (KaTeX), Mermaid diagrams in fenced `mermaid` blocks, and `==highlight==` mark syntax.

#### Scenario: Card with code and math

- **WHEN** a card question contains a fenced code block and inline math
- **THEN** the learner sees highlighted code and typeset math in the review UI
