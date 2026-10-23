CREATE TABLE IF NOT EXISTS "decks" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "topics" (
  "id" serial PRIMARY KEY NOT NULL,
  "deck_id" integer NOT NULL REFERENCES "decks"("id") ON DELETE cascade,
  "name" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "cards" (
  "id" serial PRIMARY KEY NOT NULL,
  "deck_id" integer NOT NULL REFERENCES "decks"("id") ON DELETE cascade,
  "topic_id" integer REFERENCES "topics"("id") ON DELETE set null,
  "question" text NOT NULL,
  "reference_answer" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "review_states" (
  "card_id" integer PRIMARY KEY NOT NULL REFERENCES "cards"("id") ON DELETE cascade,
  "fsrs_state" jsonb NOT NULL,
  "next_review_at" timestamp with time zone NOT NULL,
  "status" text DEFAULT 'learning' NOT NULL
);

CREATE TABLE IF NOT EXISTS "review_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "card_id" integer NOT NULL REFERENCES "cards"("id") ON DELETE cascade,
  "user_answer" text NOT NULL,
  "grading" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "llm_config" (
  "id" serial PRIMARY KEY NOT NULL,
  "base_url" text DEFAULT 'https://openrouter.ai/api/v1' NOT NULL,
  "api_key_enc" text DEFAULT '' NOT NULL,
  "default_model" text DEFAULT 'openai/gpt-4o-mini' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "api_keys" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "key_hash" text NOT NULL,
  "scopes" text[] NOT NULL,
  "last_used_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "revoked_at" timestamp with time zone
);
