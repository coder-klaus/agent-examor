## ADDED Requirements

### Requirement: Rich Markdown rendering for cards

The learner UI SHALL render card questions and reference answers with GFM, syntax-highlighted fenced code, inline and block math (KaTeX), Mermaid diagrams in fenced `mermaid` blocks, and `==highlight==` mark syntax.

#### Scenario: Card with code and math

- **WHEN** a card question contains a fenced code block and inline math
- **THEN** the learner sees highlighted code and typeset math in the review UI
