## MODIFIED Requirements

### Requirement: Rich Markdown rendering for cards

The learner UI SHALL render card questions and reference answers (and grading standard answers) with GFM, Shiki-highlighted fenced code, inline and block math, Mermaid diagrams in fenced `mermaid` blocks, and `==highlight==` mark syntax when present in the stored Markdown string. Rendering SHALL use the shared `@memor/ui` Streamdown-based `Markdown` component.

#### Scenario: Card with code and math

- **WHEN** a card question contains a fenced code block and inline math
- **THEN** the learner sees highlighted code and typeset math in the review UI

#### Scenario: Highlight syntax in reference answer

- **WHEN** grading displays a standard answer containing `==important==`
- **THEN** the highlighted span is visually distinct from surrounding text
