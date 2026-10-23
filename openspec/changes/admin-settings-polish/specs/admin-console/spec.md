## MODIFIED Requirements

### Requirement: LLM and MCP key management

The admin SHALL allow configuring LLM gateway settings and creating, listing, and revoking MCP API keys. When a key is created, the plaintext SHALL be shown once in the UI with a copy action; thereafter only metadata (name, scopes, created time, last used) is available.

#### Scenario: Issue MCP key

- **WHEN** admin creates a key with chosen name and scopes
- **THEN** the plaintext key is shown once with copy affordance and only a hash is stored

#### Scenario: List and revoke keys

- **WHEN** admin opens the API key tab
- **THEN** active keys are listed and admin can revoke a key so it no longer authenticates

#### Scenario: Pick model from gateway

- **WHEN** LLM is configured and admin refreshes the model list
- **THEN** admin can select a model from a dropdown or combobox filtered by name, or enter a custom model id
