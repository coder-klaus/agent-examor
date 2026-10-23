## ADDED Requirements

### Requirement: Admin password login

The API SHALL authenticate admin operators with a password from `ADMIN_PASSWORD` and issue an HTTP-only session cookie on successful login.

#### Scenario: Valid login

- **WHEN** the operator posts the correct password to the login endpoint
- **THEN** the response sets a session cookie and subsequent mutating admin API calls succeed

#### Scenario: Invalid login

- **WHEN** the password is wrong
- **THEN** the API returns 401 without setting a session

### Requirement: Protected admin API surface

The API SHALL reject unauthenticated requests to deck management, card creation, LLM config, API keys, and backup import/export routes while allowing unauthenticated learner review queue and grading endpoints.

#### Scenario: Unauthenticated deck mutation

- **WHEN** a client without a session attempts to create a deck
- **THEN** the API returns 401

#### Scenario: Learner grades a card

- **WHEN** the web app posts an answer to grade without an admin session
- **THEN** grading proceeds when the card exists
