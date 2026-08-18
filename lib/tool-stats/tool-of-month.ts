import { getDb } from '@/lib/db'
import { publicWidgets, type Widget } from '@/lib/constants/widgets'

export function currentYearMonth(date: Date = new Date()): string {
	return date.toISOString().slice(0, 7)
}

export function previousYearMonth(date: Date = new Date()): string {
	const prev = new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1)
	)
	return currentYearMonth(prev)
}

/** Первый id из списка (в порядке убывания просмотров), который всё ещё
 *  существует как публичный тул — так же, как POPULAR_IDS резолвится через
 *  publicWidgets в SectionWidgetsCarousel: если тул переименовали или сняли
 *  с публикации, его id молча пропускается, а не роняет баннер. */
export function resolveToolOfMonth(candidateIds: string[]): Widget | null {
	for (const id of candidateIds) {
		const widget = publicWidgets.find(w => w.id === id)
		if (widget) return widget
	}
	return null
}

async function topIdsByMonth(yearMonth: string): Promise<string[]> {
	const db = await getDb()
	const { rows } = await db.query<{ tool_id: string }>(
		'SELECT tool_id FROM tool_views_monthly WHERE year_month = $1 ORDER BY views DESC',
		[yearMonth]
	)
	return rows.map(row => row.tool_id)
}

async function topIdsAllTime(): Promise<string[]> {
	const db = await getDb()
	const { rows } = await db.query<{ tool_id: string }>(
		'SELECT tool_id FROM tool_stats ORDER BY views DESC'
	)
	return rows.map(row => row.tool_id)
}

/** Фоллбэк: текущий месяц → прошлый месяц (первые дни нового месяца, пока
 *  свежих просмотров ещё мало) → all-time (пустая/свежая БД) → null (баннер
 *  не рендерится вовсе). */
export async function getToolOfTheMonth(): Promise<Widget | null> {
	const current = resolveToolOfMonth(await topIdsByMonth(currentYearMonth()))
	if (current) return current

	const previous = resolveToolOfMonth(await topIdsByMonth(previousYearMonth()))
	if (previous) return previous

	return resolveToolOfMonth(await topIdsAllTime())
}
