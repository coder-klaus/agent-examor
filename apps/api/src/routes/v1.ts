import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db/index.js'
import {
  apiKeys,
  cards,
  decks,
  llmConfig,
  reviewLogs,
  topics,
} from '../db/schema.js'
import {
  assertBackupPayload,
  buildBackupPayload,
  restoreLibraryFromBackup,
} from '../services/backup-restore.js'
import { gradeAnswer, listLlmModels } from '../services/grading.js'
import { applyGradeToSchedule, ensureReviewState, getDueToday, getPracticeCards } from '../services/review.js'
import { encrypt, hashApiKey } from '../lib/crypto.js'
import { newSchedulerCard } from '@memor/scheduler'
import { reviewStates } from '../db/schema.js'
import { randomBytes } from 'node:crypto'
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  verifyAdminPassword,
  verifySessionToken,
} from '../lib/admin-session.js'
import { requireAdminSession } from '../middleware/admin-session.js'

async function ensureTopicId(
  deckId: number,
  topicName: string | null | undefined,
  topicMap: Map<string, number>,
): Promise<number | null> {
  if (!topicName?.trim()) return null
  const name = topicName.trim()
  if (!topicMap.has(name)) {
    const [t] = await db.insert(topics).values({ deckId, name }).returning()
    topicMap.set(name, t.id)
  }
  return topicMap.get(name) ?? null
}

async function insertCardWithSchedule(
  deckId: number,
  question: string,
  referenceAnswer: string,
  topicId: number | null,
) {
  const [card] = await db
    .insert(cards)
    .values({
      deckId,
      topicId,
      question,
      referenceAnswer,
    })
    .returning()
  const fsrsState = newSchedulerCard()
  await db.insert(reviewStates).values({
    cardId: card.id,
    fsrsState,
    nextReviewAt: fsrsState.due,
    status: 'new',
  })
  return card
}

export const v1 = new Hono()

const SESSION_MAX_AGE = 7 * 24 * 60 * 60

v1.post('/auth/login', async (c) => {
  const body = z.object({ password: z.string() }).parse(await c.req.json())
  if (!verifyAdminPassword(body.password)) {
    return c.json({ error: 'Invalid password' }, 401)
  }
  setCookie(c, ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return c.json({ ok: true })
})

v1.get('/auth/session', (c) => {
  const authed = verifySessionToken(getCookie(c, ADMIN_SESSION_COOKIE))
  return c.json({ authenticated: authed })
})

v1.post('/auth/logout', (c) => {
  deleteCookie(c, ADMIN_SESSION_COOKIE, { path: '/' })
  return c.json({ ok: true })
})

v1.use('*', requireAdminSession)

v1.get('/health', (c) => c.json({ ok: true }))

v1.get('/decks', async (c) => {
  const rows = await db.select().from(decks)
  return c.json(rows)
})

v1.post('/decks', async (c) => {
  const body = z.object({ name: z.string().min(1) }).parse(await c.req.json())
  const [row] = await db.insert(decks).values({ name: body.name }).returning()
  return c.json(row)
})

v1.patch('/decks/:deckId', async (c) => {
  const deckId = Number(c.req.param('deckId'))
  const body = z.object({ name: z.string().min(1) }).parse(await c.req.json())
  const [row] = await db.update(decks).set({ name: body.name }).where(eq(decks.id, deckId)).returning()
  if (!row) return c.json({ error: 'Deck not found' }, 404)
  return c.json(row)
})

v1.delete('/decks/:deckId', async (c) => {
  const deckId = Number(c.req.param('deckId'))
  const [row] = await db.delete(decks).where(eq(decks.id, deckId)).returning()
  if (!row) return c.json({ error: 'Deck not found' }, 404)
  return c.json({ ok: true, id: row.id })
})

v1.get('/decks/:deckId/topics', async (c) => {
  const deckId = Number(c.req.param('deckId'))
  const rows = await db.select().from(topics).where(eq(topics.deckId, deckId))
  return c.json(rows)
})

v1.get('/decks/:deckId/cards', async (c) => {
  const deckId = Number(c.req.param('deckId'))
  const rows = await db.select().from(cards).where(eq(cards.deckId, deckId))
  return c.json(rows)
})

v1.post('/decks/:deckId/cards', async (c) => {
  const deckId = Number(c.req.param('deckId'))
  const [deck] = await db.select().from(decks).where(eq(decks.id, deckId)).limit(1)
  if (!deck) return c.json({ error: 'Deck not found' }, 404)

  const body = z
    .object({
      topic: z.string().optional(),
      question: z.string().min(1),
      referenceAnswer: z.string().min(1),
    })
    .parse(await c.req.json())

  const existingTopics = await db.select().from(topics).where(eq(topics.deckId, deckId))
  const topicMap = new Map(existingTopics.map((t) => [t.name, t.id]))
  const topicId = await ensureTopicId(deckId, body.topic, topicMap)
  const card = await insertCardWithSchedule(deckId, body.question, body.referenceAnswer, topicId)
  return c.json(card)
})

v1.get('/review/today', async (c) => {
  const rows = await getDueToday(50)
  return c.json(rows)
})

v1.get('/review/practice', async (c) => {
  const deckId = c.req.query('deckId') ? Number(c.req.query('deckId')) : undefined
  const rows = await getPracticeCards(deckId, 50)
  return c.json(rows)
})

v1.post('/cards/:id/grade', async (c) => {
  const id = Number(c.req.param('id'))
  const body = z.object({ answer: z.string().min(1), practice: z.boolean().optional() }).parse(await c.req.json())
  const [card] = await db.select().from(cards).where(eq(cards.id, id)).limit(1)
  if (!card) return c.json({ error: 'Not found' }, 404)
  const grading = await gradeAnswer(card.question, card.referenceAnswer, body.answer)
  await db.insert(reviewLogs).values({
    cardId: id,
    userAnswer: body.answer,
    grading,
  })
  if (!body.practice) {
    await applyGradeToSchedule(id, grading.score)
  } else {
    await ensureReviewState(id)
  }
  return c.json(grading)
})

v1.get('/llm/config', async (c) => {
  const rows = await db.select().from(llmConfig).limit(1)
  const cfg = rows[0]
  return c.json({
    configured: Boolean(cfg?.apiKeyEnc),
    baseUrl: cfg?.baseUrl,
    defaultModel: cfg?.defaultModel,
  })
})

v1.put('/llm/config', async (c) => {
  const body = z
    .object({
      baseUrl: z.string().url(),
      apiKey: z.string().min(1).optional(),
      defaultModel: z.string().min(1),
    })
    .parse(await c.req.json())
  const existing = await db.select().from(llmConfig).limit(1)
  const prevEnc = existing[0]?.apiKeyEnc
  let apiKeyEnc = prevEnc ?? ''
  if (body.apiKey?.trim()) {
    apiKeyEnc = encrypt(body.apiKey.trim())
  } else if (!prevEnc) {
    return c.json({ error: 'API key required for initial setup' }, 400)
  }
  if (existing[0]) {
    await db
      .update(llmConfig)
      .set({
        baseUrl: body.baseUrl,
        apiKeyEnc,
        defaultModel: body.defaultModel,
        updatedAt: new Date(),
      })
      .where(eq(llmConfig.id, existing[0].id))
  } else {
    await db.insert(llmConfig).values({
      baseUrl: body.baseUrl,
      apiKeyEnc,
      defaultModel: body.defaultModel,
    })
  }
  return c.json({ ok: true })
})

v1.get('/llm/models', async (c) => {
  try {
    const models = await listLlmModels()
    return c.json({ models })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to list models'
    return c.json({ error: message }, 400)
  }
})

v1.post('/llm/test', async (c) => {
  const client = await import('../services/grading.js').then((m) => m.getLlmClient())
  if (!client) return c.json({ error: 'Not configured' }, 400)
  const cfg = await db.select().from(llmConfig).limit(1)
  const model = cfg[0]?.defaultModel ?? 'openai/gpt-4o-mini'
  await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: 'Reply with OK' }],
    max_tokens: 5,
  })
  return c.json({ ok: true })
})

v1.get('/api-keys', async (c) => {
  const rows = await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      scopes: apiKeys.scopes,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
    })
    .from(apiKeys)
    .where(isNull(apiKeys.revokedAt))
    .orderBy(apiKeys.createdAt)
  return c.json(rows)
})

v1.delete('/api-keys/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [row] = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, id), isNull(apiKeys.revokedAt)))
    .returning({ id: apiKeys.id })
  if (!row) return c.json({ error: 'Key not found' }, 404)
  return c.json({ ok: true, id: row.id })
})

v1.post('/api-keys', async (c) => {
  const body = z
    .object({
      name: z.string().min(1),
      scopes: z.array(z.enum(['cards:read', 'cards:write', 'export'])),
    })
    .parse(await c.req.json())
  const plain = `mem_${randomBytes(24).toString('hex')}`
  const [row] = await db
    .insert(apiKeys)
    .values({
      name: body.name,
      keyHash: hashApiKey(plain),
      scopes: body.scopes,
    })
    .returning({ id: apiKeys.id, name: apiKeys.name, scopes: apiKeys.scopes })
  return c.json({ ...row, key: plain })
})

v1.get('/export/backup', async (c) => {
  const deckIdRaw = c.req.query('deckId')
  const topicIdRaw = c.req.query('topicId')
  const deckId = deckIdRaw ? Number(deckIdRaw) : undefined
  const topicId =
    topicIdRaw === undefined || topicIdRaw === ''
      ? undefined
      : topicIdRaw === 'null'
        ? null
        : Number(topicIdRaw)
  try {
    const payload = await buildBackupPayload(deckId, topicId)
    return c.json(payload)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Export failed'
    return c.json({ error: message }, 400)
  }
})

v1.post('/import/library-restore', async (c) => {
  const body = z
    .object({
      backup: z.unknown(),
      source: z.object({
        deckId: z.coerce.number().int().positive(),
        topicId: z.union([z.coerce.number().int().positive(), z.null()]),
      }),
      target: z.object({
        deckId: z.coerce.number().int().positive(),
        topicId: z.coerce.number().int().positive().optional(),
        topicName: z.string().min(1).optional(),
      }),
      includeReviewStates: z.boolean().optional(),
    })
    .parse(await c.req.json())

  try {
    const backup = assertBackupPayload(body.backup)
    const result = await restoreLibraryFromBackup(
      backup,
      body.source,
      body.target,
      body.includeReviewStates ?? true,
    )
    return c.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Restore failed'
    return c.json({ error: message }, 400)
  }
})
