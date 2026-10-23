# design-system

## Purpose

Shared visual language and React primitives for Memor web and admin.

## Requirements

### Requirement: Shared design tokens and components

The `@memor/ui` package SHALL export CSS variables or Tailwind theme tokens and reusable React components (at minimum Button, Card, Badge, Progress, Textarea, Markdown) consumed by both `apps/web` and `apps/admin`.

#### Scenario: Both apps import shared styles

- **WHEN** web or admin builds
- **THEN** they import the same `@memor/ui` stylesheet and render consistent primary colors, radii, and typography

### Requirement: Theme selection and persistence

The shared stylesheet SHALL support light and dark themes via a `dark` class on the document root, a user-selectable theme (light, dark, or follow system) persisted in localStorage, and a visible theme toggle in learner and admin shells.

#### Scenario: User selects dark mode

- **WHEN** the user chooses dark theme from the toggle
- **THEN** the application uses dark tokens on the next paint and after reload until changed

#### Scenario: User selects light mode

- **WHEN** the user chooses light theme
- **THEN** dark tokens are not applied regardless of OS preference
