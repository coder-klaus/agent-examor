# mcp-api-access

## Purpose

MCP tools for AI agents to manage the question bank with API key scopes.

## Requirements

### Requirement: MCP server with API key authentication

The API SHALL expose an MCP endpoint (HTTP transport) that authenticates clients with Bearer API keys and enforces scopes.

#### Scenario: Unauthorized MCP call

- **WHEN** a request lacks a valid key or scope
- **THEN** the server rejects the operation without mutating data

### Requirement: MCP deck and card CRUD

The MCP server SHALL provide tools for listing and mutating decks and cards equivalent to admin domain operations.

#### Scenario: AI updates a card

- **WHEN** a client with `cards:write` updates a card reference answer
- **THEN** the change is visible in admin and reflected in the next grading session

### Requirement: MCP import and export

The MCP server SHALL provide tools for import preview/commit and full or partial export backup in a documented JSON format without secrets.

#### Scenario: AI exports backup

- **WHEN** a client with `export` scope requests a backup
- **THEN** the response contains decks, cards, and review state without API keys or LLM secrets
