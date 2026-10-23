## ADDED Requirements

### Requirement: Admin login gate

The admin application SHALL show a login form when no valid session exists and SHALL not render management tabs until login succeeds.

#### Scenario: Operator opens admin

- **WHEN** no session cookie is present
- **THEN** only the login screen is shown

#### Scenario: Operator logs out

- **WHEN** the operator logs out
- **THEN** the session is cleared and the login screen appears again
