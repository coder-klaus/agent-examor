## ADDED Requirements

### Requirement: Memor Markdown interchange profile

The product SHALL treat card and import Markdown as an interchange format supporting: GitHub Flavored Markdown (headings, lists, tables, task lists, blockquotes, links, images, strikethrough), fenced code blocks with language tags, inline and display math using `$...$` and `$$...$$`, and Mermaid diagrams in fenced `mermaid` code blocks.

#### Scenario: Import file uses Q/A headings

- **WHEN** an operator imports Markdown with `### Q` and `### A` sections under a `##` topic
- **THEN** the existing import parser accepts the file after BlockNote export without changing section structure

#### Scenario: Math in a card field

- **WHEN** a reference answer contains `$$E=mc^2$$`
- **THEN** the learner read renderer typesets the equation

#### Scenario: Mermaid in a card field

- **WHEN** a question contains a fenced `mermaid` block
- **THEN** the learner read renderer shows a rendered diagram (or a clear fallback if rendering fails)

### Requirement: BlockNote export compatibility

Content authored in the admin BlockNote editor SHALL be exportable to plain Markdown strings that remain valid under the Memor Markdown interchange profile for supported block types.

#### Scenario: Operator saves import document

- **WHEN** the operator edits in BlockNote and the editor emits updated Markdown
- **THEN** preview and commit APIs receive a string, not block JSON
