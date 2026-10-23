import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const url = process.env.DATABASE_URL ?? 'postgres://memor:memor@localhost:5433/memor'
const drizzleDir = join(dirname(fileURLToPath(import.meta.url)), '../../drizzle')
const files = readdirSync(drizzleDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

const sql = postgres(url)
for (const file of files) {
  const sqlPath = join(drizzleDir, file)
  const ddl = readFileSync(sqlPath, 'utf8')
  await sql.unsafe(ddl)
  console.log('Migration applied:', sqlPath)
}
await sql.end()
