## Why

Personal Admin use needs practical MCP key management (multiple keys, list, revoke, copy on create) while keeping the security model of hashed secrets. LLM setup should not require typing opaque model IDs when the gateway exposes a models list.

## What Changes

- **API keys:** `GET /api/v1/api-keys` (metadata only), `DELETE /api/v1/api-keys/:id` (revoke via `revokedAt`). Admin UI: list, create modal (name + scopes), one-time reveal modal with copy, revoke per row.
- **LLM:** `GET /api/v1/llm/models` proxied through stored credentials; Admin model picker as searchable select/combobox plus optional custom model id. `PUT /llm/config` allows omitting `apiKey` when a key is already stored.
- Plaintext MCP keys remain **show-once** at creation; server never returns them again.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `admin-console`: MCP key list/revoke UX; LLM model selection from gateway list.
- `llm-grading`: Optional model discovery endpoint using configured gateway (if spec exists).

## Impact

- `apps/api/src/routes/v1.ts`, `apps/admin/src/App.tsx`
- Possible small UI helper in `@memor/ui` (copy button pattern optional inline in admin)
