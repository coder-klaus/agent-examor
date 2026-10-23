import OpenAI from 'openai'
import type { GradingResult } from '@memor/shared'
import { decrypt } from '../lib/crypto.js'
import { db } from '../db/index.js'
import { llmConfig } from '../db/schema.js'

export async function getLlmClient(): Promise<OpenAI | null> {
  const row = await db.select().from(llmConfig).limit(1)
  const cfg = row[0]
  if (!cfg?.apiKeyEnc) return null
  const apiKey = decrypt(cfg.apiKeyEnc)
  return new OpenAI({
    apiKey,
    baseURL: cfg.baseUrl,
  })
}

export async function listLlmModels(): Promise<string[]> {
  const client = await getLlmClient()
  if (!client) throw new Error('LLM not configured')
  const page = await client.models.list()
  const ids = [...page.data].map((m) => m.id).filter(Boolean)
  return [...new Set(ids)].sort((a, b) => a.localeCompare(b))
}

export async function gradeAnswer(
  question: string,
  referenceAnswer: string,
  userAnswer: string,
): Promise<GradingResult> {
  const client = await getLlmClient()
  if (!client) {
    throw new Error('LLM not configured')
  }
  const cfg = await db.select().from(llmConfig).limit(1)
  const model = cfg[0]?.defaultModel ?? 'openai/gpt-4o-mini'

  const completion = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You grade learner answers. Return JSON: score (0-10 integer), standardAnswer, mistakes (string array), improvements (string array). Use reference_answer as ground truth.',
      },
      {
        role: 'user',
        content: JSON.stringify({ question, reference_answer: referenceAnswer, user_answer: userAnswer }),
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content ?? '{}'
  let parsed: GradingResult
  try {
    const j = JSON.parse(raw) as GradingResult
    parsed = {
      score: Number(j.score) || 0,
      standardAnswer: j.standardAnswer || referenceAnswer,
      mistakes: j.mistakes ?? [],
      improvements: j.improvements ?? [],
      raw,
    }
  } catch {
    parsed = {
      score: 0,
      standardAnswer: referenceAnswer,
      mistakes: ['Failed to parse model JSON'],
      improvements: [],
      raw,
    }
  }
  return parsed
}
