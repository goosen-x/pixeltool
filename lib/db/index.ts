import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

let pool: Pool | null = null
let schemaReady: Promise<void> | null = null

function getPool(): Pool {
	if (!pool) {
		pool = new Pool({ connectionString: process.env.DATABASE_URL })
	}
	return pool
}

// Ленивая миграция: применяется один раз за время жизни процесса, при первом
// реальном запросе к БД — отдельного шага деплоя для схемы нет.
function ensureSchema(db: Pool): Promise<void> {
	if (!schemaReady) {
		const sql = readFileSync(join(process.cwd(), 'lib/db/schema.sql'), 'utf8')
		schemaReady = db.query(sql).then(
			() => undefined,
			error => {
				// Один сбой (например, БД временно недоступна) не должен навсегда
				// «отравлять» схему для всех последующих запросов процесса —
				// сбрасываем кэш, чтобы следующий getDb() попробовал снова.
				schemaReady = null
				throw error
			}
		)
	}
	return schemaReady
}

export async function getDb(): Promise<Pool> {
	const db = getPool()
	await ensureSchema(db)
	return db
}
