import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '../lib/admin-session.js'

export function v1RelativePath(c: Context): string {
  const p = c.req.path.replace(/\/+$/, '') || '/'
  const prefix = '/api/v1'
  if (p.startsWith(prefix)) return p.slice(prefix.length) || '/'
  return p
}

/** Paths on the v1 router (no /api/v1 prefix). Method-specific where noted. */
export function isPublicV1Path(path: string, method: string): boolean {
  if (path === '/health' && method === 'GET') return true
  if (path === '/auth/login' && method === 'POST') return true
  if (path === '/auth/session' && method === 'GET') return true
  if (path === '/auth/logout' && method === 'POST') return true
  if (path === '/review/today' && method === 'GET') return true
  if (path === '/review/practice' && method === 'GET') return true
  if (/^\/cards\/\d+\/grade$/.test(path) && method === 'POST') return true
  return false
}

export const requireAdminSession = createMiddleware(async (c, next) => {
  const path = v1RelativePath(c)
  if (isPublicV1Path(path, c.req.method)) return next()
  const token = getCookie(c, ADMIN_SESSION_COOKIE)
  if (!verifySessionToken(token)) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})
