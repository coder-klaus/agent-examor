## ADDED Requirements

### Requirement: BlockNote code block syntax highlighting

The shared `MarkdownEditor` SHALL register the BlockNote code-block extension with Shiki-based syntax highlighting and a supported-language list so operators can choose a language on code blocks in the admin import editor.

#### Scenario: Operator inserts a code block

- **WHEN** the operator adds a fenced code block and selects a language such as TypeScript
- **THEN** the editor shows syntax-highlighted tokens while editing

#### Scenario: Code block exports to Markdown

- **WHEN** the editor emits Markdown after editing a code block
- **THEN** the fence includes a language tag compatible with the Memor Markdown profile
