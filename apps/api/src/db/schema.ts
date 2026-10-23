import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const decks = pgTable('decks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  deckId: integer('deck_id')
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
})

export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  deckId: integer('deck_id')
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),
  topicId: integer('topic_id').references(() => topics.id, { onDelete: 'set null' }),
  question: text('question').notNull(),
  referenceAnswer: text('reference_answer').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const reviewStates = pgTable('review_states', {
  cardId: integer('card_id')
    .primaryKey()
    .references(() => cards.id, { onDelete: 'cascade' }),
  fsrsState: jsonb('fsrs_state').notNull(),
  nextReviewAt: timestamp('next_review_at', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('learning'),
})

export const reviewLogs = pgTable('review_logs', {
  id: serial('id').primaryKey(),
  cardId: integer('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  userAnswer: text('user_answer').notNull(),
  grading: jsonb('grading').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const llmConfig = pgTable('llm_config', {
  id: serial('id').primaryKey(),
  baseUrl: text('base_url').notNull().default('https://openrouter.ai/api/v1'),
  apiKeyEnc: text('api_key_enc').notNull().default(''),
  defaultModel: text('default_model').notNull().default('openai/gpt-4o-mini'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull(),
  scopes: text('scopes').array().notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
})

