## ADDED Requirements

### Requirement: Non-blocking admin notifications

The admin application SHALL use in-app toast or inline status messages for import, LLM save, and connectivity test outcomes instead of blocking browser `alert` dialogs.

#### Scenario: Import commit succeeds

- **WHEN** commit completes successfully
- **THEN** a non-blocking success message appears and the operator can continue working

### Requirement: Import preview presentation

The import flow SHALL show preview results (card count and validation errors) in a scannable list or summary block before commit.

#### Scenario: Preview with errors

- **WHEN** preview returns validation errors
- **THEN** errors are listed distinctly from the success card count
