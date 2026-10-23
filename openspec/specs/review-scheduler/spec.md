# review-scheduler

## Purpose

FSRS-based spaced repetition queues and optional practice mode.

## Requirements

### Requirement: FSRS-based scheduling

The system SHALL schedule card reviews using FSRS (or equivalent packaged scheduler) and store per-card review state including next review date.

#### Scenario: After graded review

- **WHEN** a learner completes a review session with a grade
- **THEN** the card's FSRS state and `next_review_at` are updated

### Requirement: Daily review queue

The system SHALL expose overdue, due-today, and new-card quota queues for scheduled study (not practice mode).

#### Scenario: Open today queue on web

- **WHEN** the learner opens the today view
- **THEN** the API returns cards due by scheduler rules up to configured daily limits

### Requirement: Practice mode

The system SHALL allow the learner to study a filtered subset (deck, topic, mastery status) in practice mode without applying full schedule updates or with a documented reduced effect.

#### Scenario: Practice mastered cards

- **WHEN** the learner selects mastered cards in practice mode
- **THEN** the system presents cards without treating the session as mandatory daily queue
