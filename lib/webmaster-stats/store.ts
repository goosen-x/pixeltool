import { getDb } from '@/lib/db'
import type { WebmasterStatRow } from './schema'

export async function saveWebmasterStats(
	rows: WebmasterStatRow[]
): Promise<void> {
	const db = await getDb()
	for (const row of rows) {
		await db.query(
			`INSERT INTO webmaster_url_stats
				(path, period_start, period_end, impressions, clicks, ctr, avg_position, avg_click_position)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			ON CONFLICT (path, period_start, period_end) DO UPDATE SET
				impressions = EXCLUDED.impressions,
				clicks = EXCLUDED.clicks,
				ctr = EXCLUDED.ctr,
				avg_position = EXCLUDED.avg_position,
				avg_click_position = EXCLUDED.avg_click_position,
				imported_at = now()`,
			[
				row.path,
				row.periodStart,
				row.periodEnd,
				row.impressions,
				row.clicks,
				row.ctr,
				row.avgPosition,
				row.avgClickPosition
			]
		)
	}
}

export interface WebmasterStatRecord extends WebmasterStatRow {
	importedAt: string
}

export async function getAllWebmasterStats(): Promise<WebmasterStatRecord[]> {
	const db = await getDb()
	const { rows } = await db.query(
		`SELECT path, period_start, period_end, impressions, clicks, ctr,
			avg_position, avg_click_position, imported_at
		FROM webmaster_url_stats
		ORDER BY period_end DESC, impressions DESC`
	)
	return rows.map(r => ({
		path: r.path,
		periodStart: r.period_start.toISOString().slice(0, 10),
		periodEnd: r.period_end.toISOString().slice(0, 10),
		impressions: Number(r.impressions),
		clicks: Number(r.clicks),
		ctr: Number(r.ctr),
		avgPosition: r.avg_position === null ? null : Number(r.avg_position),
		avgClickPosition:
			r.avg_click_position === null ? null : Number(r.avg_click_position),
		importedAt: r.imported_at.toISOString()
	}))
}
