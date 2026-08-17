import { getDb } from '@/lib/db'

export interface ToolStats {
	views: number
	rating: number
	ratingCount: number
}

interface ToolStatsRow {
	tool_id: string
	views: string
	rating_sum: number
	rating_count: number
}

/** Общая точка чтения tool_stats — используется и API-роутом (клиентский
 *  счётчик/звёзды), и серверным layout'ом тулов (aggregateRating в JSON-LD). */
export async function getAllToolStats(): Promise<Record<string, ToolStats>> {
	const db = await getDb()
	const { rows } = await db.query<ToolStatsRow>(
		'SELECT tool_id, views, rating_sum, rating_count FROM tool_stats'
	)

	return Object.fromEntries(
		rows.map(row => [
			row.tool_id,
			{
				views: Number(row.views),
				rating: row.rating_count > 0 ? row.rating_sum / row.rating_count : 0,
				ratingCount: row.rating_count
			}
		])
	)
}
