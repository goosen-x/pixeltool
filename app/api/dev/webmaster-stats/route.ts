import { NextRequest, NextResponse } from 'next/server'
import { dev } from '@/lib/config/env'
import { importWebmasterStatsSchema } from '@/lib/webmaster-stats/schema'
import { parseWebmasterCsv } from '@/lib/webmaster-stats/parse-csv'
import { saveWebmasterStats } from '@/lib/webmaster-stats/store'

// Тот же принцип, что у страницы /dev/webmaster-stats: 404 на проде, роут
// только для локальной разработки (через SSH-туннель к боевой БД).
export async function POST(request: NextRequest) {
	if (!dev) return new NextResponse(null, { status: 404 })

	let body: unknown
	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
	}

	const parsed = importWebmasterStatsSchema.safeParse(body)
	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })
	}

	try {
		const rows = parseWebmasterCsv(parsed.data.csv)
		await saveWebmasterStats(rows)
		return NextResponse.json({ imported: rows.length })
	} catch (error) {
		console.error('Не удалось импортировать отчёт Вебмастера:', error)
		return NextResponse.json(
			{ error: 'Не удалось разобрать или сохранить CSV' },
			{ status: 500 }
		)
	}
}
