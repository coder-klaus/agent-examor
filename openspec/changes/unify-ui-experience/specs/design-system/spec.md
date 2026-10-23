## ADDED Requirements

### Requirement: Shared design tokens and components

The `@memor/ui` package SHALL export CSS variables or Tailwind theme tokens and reusable React components (at minimum Button, Card, Badge, Progress, Textarea, Markdown) consumed by both `apps/web` and `apps/admin`.

#### Scenario: Both apps import shared styles

- **WHEN** web or admin builds
- **THEN** they import the same `@memor/ui` stylesheet and render consistent primary colors, radii, and typography

### Requirement: System color scheme support

The shared stylesheet SHALL support light defaults and respect `prefers-color-scheme: dark` for background and text contrast without a manual theme toggle.

#### Scenario: Dark mode OS setting

- **WHEN** the user OS prefers dark mode
- **THEN** learner and admin surfaces use dark background tokens with readable text
