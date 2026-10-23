## MODIFIED Requirements

### Requirement: System color scheme support

The shared stylesheet SHALL support light and dark themes via a `dark` class on the document root, a user-selectable theme (light, dark, or follow system) persisted in localStorage, and a visible theme toggle in learner and admin shells.

#### Scenario: User selects dark mode

- **WHEN** the user chooses dark theme from the toggle
- **THEN** the application uses dark tokens on the next paint and after reload until changed

#### Scenario: User selects light mode

- **WHEN** the user chooses light theme
- **THEN** dark tokens are not applied regardless of OS preference
