## ADDED Requirements

### Requirement: Backup and restore in admin

The admin SHALL provide a backup tab where the operator can export JSON for a selected deck and library (topic) and import a backup file into a chosen target deck and library.

#### Scenario: Operator exports a library

- **WHEN** the operator selects deck and library and clicks export
- **THEN** a JSON file download starts with scoped backup content

#### Scenario: Operator imports into target library

- **WHEN** the operator uploads a backup file and confirms target deck and library
- **THEN** cards from the selected source library in the file are appended to the target library
