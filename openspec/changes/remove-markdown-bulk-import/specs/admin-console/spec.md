## MODIFIED Requirements

### Requirement: Desktop-first admin

The `apps/admin` application SHALL prioritize desktop layouts for deck/card CRUD (including per-card Q/A entry), LLM configuration, MCP API key management, and review log inspection. The admin SHALL NOT provide a bulk Markdown import tab or import preview/commit UI.

#### Scenario: Operator adds a card

- **WHEN** the operator uses the add-card tab with question and reference answer fields
- **THEN** the card is created on the selected deck via the cards API

### Requirement: LLM and MCP key management

The admin SHALL allow configuring LLM gateway settings and creating, revoking, and scoping MCP API keys. Issuable scopes SHALL include `cards:read`, `cards:write`, and `export` but not a dedicated `import` scope.

#### Scenario: Issue MCP key

- **WHEN** admin creates a key with `cards:read` and `export` scopes
- **THEN** the plaintext key is shown once and only a hash is stored

### Requirement: Non-blocking admin notifications

The admin application SHALL use in-app toast or inline status messages for card add, LLM save, and connectivity test outcomes instead of blocking browser `alert` dialogs.

#### Scenario: Card add succeeds

- **WHEN** a card is added successfully
- **THEN** a non-blocking success message appears and the operator can continue working

## REMOVED Requirements

### Requirement: Import preview presentation

**Reason**: Bulk Markdown import is removed.

**Migration**: Use add-card flow or API/MCP write paths (when available).

### Requirement: Rich Markdown import editor

**Reason**: No dedicated import document editor; Markdown editors remain on per-card Q/A fields only.

**Migration**: Enter content in add-card editors instead of a bulk import tab.
