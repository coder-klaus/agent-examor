import { and, eq, isNull } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'
import type { ApiScope } from '@memor/shared'
import { hashApiKey } from '../lib/crypto.js'
import { db } from '../db/index.js'
import { apiKeys } from '../db/schema.js'

export type ApiKeyVars = {
  apiKeyScopes: ApiScope[]
}

export function requireApiKey(scopes: ApiScope[]) {
  return createMiddleware<{ Variables: ApiKeyVars }>(async (c, next) => {
    const auth = c.req.header('Authorization')
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return c.json({ error: 'Unauthorized' }, 401)

    const hash = hashApiKey(token)
    const rows = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, hash), isNull(apiKeys.revokedAt)))
      .limit(1)
    const row = rows[0]
    if (!row) return c.json({ error: 'Invalid API key' }, 401)

    const has = scopes.every((s) => row.scopes.includes(s))
    if (!has) return c.json({ error: 'Insufficient scope' }, 403)

    await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, row.id))
    c.set('apiKeyScopes', row.scopes as ApiScope[])
    await next()
  })
}
