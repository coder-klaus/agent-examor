## MODIFIED Requirements

### Requirement: Theme selection and persistence

The shared stylesheet SHALL support light and dark themes via a `dark` class on the document root, a user-selectable theme (light, dark, or follow system) persisted in localStorage, and a visible theme toggle in learner and admin shells. In the light theme, sidebar surfaces (`bg-sidebar`) SHALL use a light background and dark text; in the dark theme, sidebar surfaces SHALL use the existing dark palette.

#### Scenario: User selects dark mode

- **WHEN** the user chooses dark theme from the toggle
- **THEN** the application uses dark tokens on the next paint and after reload until changed

#### Scenario: User selects light mode

- **WHEN** the user chooses light theme
- **THEN** dark tokens are not applied regardless of OS preference

#### Scenario: Admin sidebar in light mode

- **WHEN** the resolved theme is light and the admin layout renders the navigation aside
- **THEN** the aside background is a light surface, not the same color as the dark-mode sidebar

## ADDED Requirements

### Requirement: Streamdown theme integration

The shared `Markdown` component SHALL expose correctly styled code blocks (Shiki syntax highlighting) and Mermaid diagrams when content uses fenced code and `mermaid` blocks, in both light and dark resolved themes. The stylesheet SHALL define shadcn-compatible CSS custom properties consumed by Streamdown and SHALL include Tailwind v4 `@source` directives for Streamdown and its code and Mermaid plugin packages in application entry CSS.

#### Scenario: Card with JavaScript code fence

- **WHEN** a learner views a question containing a fenced `javascript` code block
- **THEN** the code block shows syntax-highlighted tokens readable against the themed background

#### Scenario: Card with Mermaid fence

- **WHEN** a learner views content with a fenced `mermaid` diagram block
- **THEN** a rendered diagram (not only plain text) is visible in the review UI
