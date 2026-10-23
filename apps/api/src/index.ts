import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { v1 } from './routes/v1.js'
import { requireApiKey } from './middleware/api-key.js'
import { eq } from 'drizzle-orm'
import { db } from './db/index.js'
import { cards, decks } from './db/schema.js'
import {
  assertBackupPayload,
  buildBackupPayload,
  restoreLibraryFromBackup,
} from './services/backup-restore.js'
import { z } from 'zod'

const app = new Hono()
app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))
app.route('/api/v1', v1)

/** MCP-compatible tool dispatch (Bearer API key). Full Streamable HTTP can be added later. */
const mcp = new Hono()

const toolScopes: Record<string, import('@memor/shared').ApiScope[]> = {
  deck_list: ['cards:read'],
  card_list: ['cards:read'],
  export_backup: ['export'],
  import_library_restore: ['cards:write'],
}

mcp.post('/invoke', requireApiKey(['cards:read']), async (c) => {
  const body = z
    .object({
      tool: z.string(),
      arguments: z.record(z.unknown()).optional(),
    })
    .parse(await c.req.json())

  const needed = toolScopes[body.tool]
  if (!needed) return c.json({ error: `Unknown tool: ${body.tool}` }, 400)
  const scopes = c.get('apiKeyScopes')
  if (!needed.every((s) => scopes.includes(s))) {
    return c.json({ error: 'Insufficient scope' }, 403)
  }

  switch (body.tool) {
    case 'deck_list': {
      const rows = await db.select().from(decks)
      return c.json({ result: rows })
    }
    case 'card_list': {
      const deckId = Number(body.arguments?.deckId)
      const rows = await db.select().from(cards).where(eq(cards.deckId, deckId))
      return c.json({ result: rows })
    }
    case 'export_backup': {
      const deckId = body.arguments?.deckId != null ? Number(body.arguments.deckId) : undefined
      const topicArg = body.arguments?.topicId
      const topicId =
        topicArg === undefined || topicArg === null
          ? undefined
          : topicArg === 'null'
            ? null
            : Number(topicArg)
      const payload = await buildBackupPayload(deckId, topicId)
      return c.json({ result: payload })
    }
    case 'import_library_restore': {
      const backup = assertBackupPayload(body.arguments?.backup)
      const source = z
        .object({
          deckId: z.coerce.number().int().positive(),
          topicId: z.union([z.coerce.number().int().positive(), z.null()]),
        })
        .parse(body.arguments?.source)
      const target = z
        .object({
          deckId: z.coerce.number().int().positive(),
          topicId: z.coerce.number().int().positive().optional(),
          topicName: z.string().min(1).optional(),
        })
        .parse(body.arguments?.target)
      const includeReviewStates = body.arguments?.includeReviewStates !== false
      const result = await restoreLibraryFromBackup(backup, source, target, includeReviewStates)
      return c.json({ result })
    }
  }
})

mcp.get('/tools', requireApiKey(['cards:read']), (c) =>
  c.json({
    tools: ['deck_list', 'card_list', 'export_backup', 'import_library_restore'],
  }),
)

app.route('/mcp', mcp)

const port = Number(process.env.PORT ?? 3000)
console.log(`Memor API listening on ${port}`)
serve({ fetch: app.fetch, port })
