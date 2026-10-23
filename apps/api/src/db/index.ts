import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const url = process.env.DATABASE_URL ?? 'postgres://memor:memor@localhost:5433/memor'

const client = postgres(url)
export const db = drizzle(client, { schema })
