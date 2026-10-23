## MODIFIED Requirements

### Requirement: Rich Markdown import editor

The admin import flow SHALL provide block-based WYSIWYG editing (BlockNote) for deck import content, storing plain Markdown compatible with existing `### Q` / `### A` import rules. The editor SHALL load initial Markdown via BlockNote markdown import and emit updated Markdown on change for preview and commit.

#### Scenario: Operator edits import markdown

- **WHEN** the operator uses the import tab
- **THEN** they can add and rearrange blocks with slash commands and formatting controls typical of Notion-style editors

#### Scenario: Operator previews after edit

- **WHEN** the operator triggers import preview
- **THEN** the API receives the Markdown string produced from the current editor document
