import { eq } from 'drizzle-orm'
import { newSchedulerCard } from '@memor/scheduler'
import { db } from '../db/index.js'
import { cards, decks, reviewStates, topics } from '../db/schema.js'

export type BackupPayload = {
  schemaVersion: number
  exportedAt?: string
  decks: { id: number; name: string; createdAt?: Date | string }[]
  topics: { id: number; deckId: number; name: string }[]
  cards: {
    id: number
    deckId: number
    topicId: number | null
    question: string
    referenceAnswer: string
    createdAt?: Date | string
  }[]
  reviewStates: {
    cardId: number
    fsrsState: unknown
    nextReviewAt: Date | string
    status: string
  }[]
}

export function assertBackupPayload(raw: unknown): BackupPayload {
  const p = raw as BackupPayload
  if (!p || p.schemaVersion !== 1 || !Array.isArray(p.cards)) {
    throw new Error('Invalid backup: schemaVersion 1 required')
  }
  return {
    schemaVersion: 1,
    exportedAt: p.exportedAt,
    decks: p.decks ?? [],
    topics: p.topics ?? [],
    cards: p.cards ?? [],
    reviewStates: p.reviewStates ?? [],
  }
}

export async function buildBackupPayload(
  deckId?: number,
  topicId?: number | null,
): Promise<BackupPayload> {
  const allDecks = await db.select().from(decks)
  const allTopics = await db.select().from(topics)
  const allCards = await db.select().from(cards)
  const states = await db.select().from(reviewStates)

  if (deckId == null) {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      decks: allDecks,
      topics: allTopics,
      cards: allCards,
      reviewStates: states,
    }
  }

  const deck = allDecks.find((d) => d.id === deckId)
  if (!deck) throw new Error('Deck not found')

  let filteredCards = allCards.filter((c) => c.deckId === deckId)
  if (topicId !== undefined) {
    filteredCards = filteredCards.filter((c) => c.topicId === topicId)
  }

  const cardIds = new Set(filteredCards.map((c) => c.id))
  const topicIds = new Set(
    filteredCards.map((c) => c.topicId).filter((id): id is number => id != null),
  )

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    decks: [deck],
    topics: allTopics.filter((t) => t.deckId === deckId && (topicId === undefined || topicIds.has(t.id))),
    cards: filteredCards,
    reviewStates: states.filter((s) => cardIds.has(s.cardId)),
  }
}

async function resolveTargetTopicId(
  targetDeckId: number,
  target: { topicId?: number; topicName?: string },
  sourceTopicName: string | null,
): Promise<number | null> {
  if (target.topicId !== undefined) {
    const [row] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, target.topicId))
      .limit(1)
    if (!row || row.deckId !== targetDeckId) throw new Error('Target topic not in deck')
    return row.id
  }
  const name = (target.topicName ?? sourceTopicName)?.trim()
  if (!name) return null
  const existing = await db.select().from(topics).where(eq(topics.deckId, targetDeckId))
  const found = existing.find((t) => t.name === name)
  if (found) return found.id
  const [created] = await db.insert(topics).values({ deckId: targetDeckId, name }).returning()
  return created.id
}

export async function restoreLibraryFromBackup(
  backup: BackupPayload,
  source: { deckId: number; topicId: number | null },
  target: { deckId: number; topicId?: number; topicName?: string },
  includeReviewStates: boolean,
): Promise<{ imported: number }> {
  const [targetDeck] = await db.select().from(decks).where(eq(decks.id, target.deckId)).limit(1)
  if (!targetDeck) throw new Error('Target deck not found')

  const sourceTopicId = source.topicId
  const toImport = backup.cards.filter(
    (c) => c.deckId === source.deckId && c.topicId === sourceTopicId,
  )
  if (toImport.length === 0) throw new Error('No cards match source deck and library')

  const sourceTopicRow =
    sourceTopicId != null ? backup.topics.find((t) => t.id === sourceTopicId) : undefined
  const targetTopicId = await resolveTargetTopicId(
    target.deckId,
    target,
    sourceTopicRow?.name ?? null,
  )

  const stateByCard = new Map(backup.reviewStates.map((s) => [s.cardId, s]))
  let imported = 0

  for (const item of toImport) {
    const [card] = await db
      .insert(cards)
      .values({
        deckId: target.deckId,
        topicId: targetTopicId,
        question: item.question,
        referenceAnswer: item.referenceAnswer,
      })
      .returning()

    const saved = includeReviewStates ? stateByCard.get(item.id) : undefined
    if (saved) {
      await db.insert(reviewStates).values({
        cardId: card.id,
        fsrsState: saved.fsrsState,
        nextReviewAt: new Date(saved.nextReviewAt),
        status: saved.status,
      })
    } else {
      const fsrsState = newSchedulerCard()
      await db.insert(reviewStates).values({
        cardId: card.id,
        fsrsState,
        nextReviewAt: fsrsState.due,
        status: 'new',
      })
    }
    imported++
  }

  return { imported }
}
