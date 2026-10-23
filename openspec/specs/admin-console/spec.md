# admin-console

## Purpose

Desktop-first management UI for content, LLM, and MCP keys.

## Requirements

### Requirement: Desktop-first admin

The `apps/admin` application SHALL prioritize desktop layouts for deck/card CRUD, import UI, LLM configuration, MCP API key management, and review log inspection.

#### Scenario: Admin imports deck

- **WHEN** an operator uploads Markdown through admin
- **THEN** preview errors or commit success is shown in tabular or list form

### Requirement: LLM and MCP key management

The admin SHALL allow configuring LLM gateway settings and creating, revoking, and scoping MCP API keys.

#### Scenario: Issue MCP key

- **WHEN** admin creates a key with `import` and `export` scopes
- **THEN** the plaintext key is shown once and only a hash is stored

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

### Requirement: Rich Markdown import editor

The admin import flow SHALL provide a WYSIWYG Markdown editor with an optional source view for deck import content, storing plain Markdown compatible with existing `### Q` / `### A` import rules.

#### Scenario: Operator edits import markdown

- **WHEN** the operator uses the import tab
- **THEN** they can format content in a visual editor with toolbar controls and optionally switch to Markdown source
