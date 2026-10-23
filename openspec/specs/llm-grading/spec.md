# llm-grading

## Purpose

Server-side LLM grading via OpenAI-compatible gateways (OpenRouter, LiteLLM, etc.).

## Requirements

### Requirement: OpenAI-compatible LLM configuration

The system SHALL store LLM settings with `base_url`, `api_key`, and `default_model` so gateways such as OpenRouter or self-hosted LiteLLM work without code changes.

#### Scenario: Configure OpenRouter

- **WHEN** admin sets `base_url` to `https://openrouter.ai/api/v1` and a valid API key and model id
- **THEN** test connection succeeds from admin or API health tool

### Requirement: Structured grading response

The system SHALL grade learner answers via server-side LLM calls and return structured results including score, reference alignment, mistakes, and improvement suggestions, using imported `reference_answer` as the primary ground truth.

#### Scenario: Submit answer on web

- **WHEN** the learner submits an answer for a card
- **THEN** the API persists a review log and returns grading fields to the client

### Requirement: Secrets not exposed to web clients

The system SHALL NOT expose raw LLM API keys to the learner web app; only admin and server-side grading may use decrypted keys.

#### Scenario: Learner opens settings

- **WHEN** the learner views web settings
- **THEN** they see whether LLM is configured but not the secret key value
