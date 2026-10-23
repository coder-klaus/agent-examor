import { eq, lte } from 'drizzle-orm'
import {
  Rating,
  newSchedulerCard,
  scheduleAfterRating,
  type Grade,
  type SchedulerCard,
} from '@memor/scheduler'
import { db } from '../db/index.js'
import { cards, reviewStates } from '../db/schema.js'

function scoreToRating(score: number): Grade {
  if (score >= 8) return Rating.Easy
  if (score >= 5) return Rating.Good
  if (score >= 3) return Rating.Hard
  return Rating.Again
}

export async function ensureReviewState(cardId: number) {
  const existing = await db.select().from(reviewStates).where(eq(reviewStates.cardId, cardId))
  if (existing[0]) return existing[0]
  const fsrsState = newSchedulerCard()
  const next = fsrsState.due
  await db.insert(reviewStates).values({
    cardId,
    fsrsState,
    nextReviewAt: next,
    status: 'learning',
  })
  return { cardId, fsrsState, nextReviewAt: next, status: 'learning' }
}

export async function applyGradeToSchedule(cardId: number, score: number) {
  const state = await ensureReviewState(cardId)
  const card = state.fsrsState as SchedulerCard
  const updated = scheduleAfterRating(card, scoreToRating(score))
  await db
    .update(reviewStates)
    .set({
      fsrsState: updated,
      nextReviewAt: updated.due,
      status: 'review',
    })
    .where(eq(reviewStates.cardId, cardId))
}

export async function getDueToday(limit = 20) {
  const now = new Date()
  return db
    .select({ card: cards, state: reviewStates })
    .from(cards)
    .innerJoin(reviewStates, eq(cards.id, reviewStates.cardId))
    .where(lte(reviewStates.nextReviewAt, now))
    .limit(limit)
}

export async function getPracticeCards(deckId?: number, limit = 30) {
  const q = db.select().from(cards).limit(limit)
  if (deckId) {
    return db.select().from(cards).where(eq(cards.deckId, deckId)).limit(limit)
  }
  return q
}
