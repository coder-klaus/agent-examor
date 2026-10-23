import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade } from 'ts-fsrs'

const params = generatorParameters({ enable_fuzz: true })
const f = fsrs(params)

export type SchedulerCard = Card

export function newSchedulerCard(): SchedulerCard {
  return createEmptyCard(new Date())
}

export function scheduleAfterRating(card: SchedulerCard, rating: Grade, now = new Date()) {
  const record = f.next(card, now, rating)
  return record.card
}

export { Rating, type Grade }
