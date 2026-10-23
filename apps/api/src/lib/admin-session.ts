import { createHmac, timingSafeEqual } from 'node:crypto'

export const ADMIN_SESSION_COOKIE = 'memor_admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'huaerjie001'
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ENCRYPTION_KEY ?? 'dev-session-secret'
}

export function createSessionToken(): string {
  const exp = String(Date.now() + SESSION_TTL_MS)
  const sig = createHmac('sha256', sessionSecret()).update(exp).digest('hex')
  return `${exp}.${sig}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [expStr, sig] = token.split('.')
  if (!expStr || !sig) return false
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < Date.now()) return false
  const expected = createHmac('sha256', sessionSecret()).update(expStr).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = adminPassword()
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
