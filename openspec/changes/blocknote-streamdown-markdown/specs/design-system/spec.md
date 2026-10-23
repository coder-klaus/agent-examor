## MODIFIED Requirements

### Requirement: Shared design tokens and components

The `@memor/ui` package SHALL export CSS variables or Tailwind theme tokens and reusable React components (at minimum Button, Card, Badge, Progress, Textarea, Markdown) consumed by both `apps/web` and `apps/admin`. The `Markdown` component SHALL render content using Streamdown in static mode with plugins for code highlighting, math, and Mermaid. The package SHALL export a `MarkdownEditor` component built on BlockNote for block-based Markdown authoring that reads and writes plain Markdown strings.

#### Scenario: Both apps import shared styles

- **WHEN** web or admin builds
- **THEN** they import the same `@memor/ui` stylesheet and render consistent primary colors, radii, and typography

#### Scenario: Learner reads card content

- **WHEN** web passes a Markdown string to `Markdown`
- **THEN** Streamdown renders GFM and profile extensions without mounting BlockNote

## ADDED Requirements

### Requirement: BlockNote editor dependencies

The shared UI package SHALL depend on maintained BlockNote packages (`@blocknote/core`, `@blocknote/react`, and a documented UI adapter) and SHALL NOT depend on `@mdxeditor/editor` after this change ships.

#### Scenario: Admin build resolves editor

- **WHEN** `apps/admin` imports `MarkdownEditor` from `@memor/ui`
- **THEN** the dev server resolves BlockNote modules without missing import errors
