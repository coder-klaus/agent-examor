## Context

`api_keys` has `revokedAt`; only `POST /api-keys` exists. LLM config is free-text model field; OpenAI SDK `client.models.list()` works for compatible gateways.

## Goals / Non-Goals

**Goals:** List/revoke keys; create with name; copy once; fetch models server-side; combobox + custom model fallback.

**Non-Goals:** Re-display revoked key plaintext; edit scopes after create; multi-LLM profiles.

## Decisions

1. **Revoke not hard-delete** — `DELETE` sets `revokedAt`; list hides revoked by default.
2. **Models endpoint** — `GET /llm/models` uses `getLlmClient()`; returns `{ models: { id: string }[] }` sorted; errors as 400 with message.
3. **Config PUT** — `apiKey` optional string; if omitted and DB has `apiKeyEnc`, keep existing encryption.
4. **Admin defaults** — New key scopes default all three; name required in modal.

## Risks / Trade-offs

- Large model lists → client-side filter on combobox input.
- Some gateways lack `/models` → show error + keep manual custom model input.
