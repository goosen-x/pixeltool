import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getWidgetById } from '@/lib/constants/widgets'
import { toolStatsActionSchema } from '@/lib/tool-stats/schema'
import { createRateLimiter } from '@/lib/tool-stats/rate-limit'

// Один процесс на контейнер (без serverless, см. CLAUDE.md), поэтому лимитер
// в памяти модуля реально копит историю между запросами.
const rateLimiter = createRateLimiter(20, 60 * 60 * 1000)

function clientIp(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for') ||
		request.headers.get('x-real-ip') ||
		'unknown'
	)
}

interface ToolStatsRow {
	tool_id: string
	views: string
	rating_sum: number
	rating_count: number
}

export async function GET() {
	const db = await getDb()
	const { rows } = await db.query<ToolStatsRow>(
		'SELECT tool_id, views, rating_sum, rating_count FROM tool_stats'
	)

	const stats = Object.fromEntries(
		rows.map(row => [
			row.tool_id,
			{
				views: Number(row.views),
				rating: row.rating_count > 0 ? row.rating_sum / row.rating_count : 0,
				ratingCount: row.rating_count
			}
		])
	)

	return NextResponse.json(stats)
}

export async function POST(request: NextRequest) {
	let body: unknown

	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
	}

	const parsed = toolStatsActionSchema.safeParse(body)
	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })
	}

	if (!getWidgetById(parsed.data.toolId)) {
		return NextResponse.json({ error: 'Тул не найден' }, { status: 404 })
	}

	const db = await getDb()

	if (parsed.data.action === 'view') {
		const { rows } = await db.query<{ views: string }>(
			`INSERT INTO tool_stats (tool_id, views) VALUES ($1, 1)
			 ON CONFLICT (tool_id) DO UPDATE SET views = tool_stats.views + 1
			 RETURNING views`,
			[parsed.data.toolId]
		)
		return NextResponse.json({ views: Number(rows[0].views) })
	}

	if (!rateLimiter.check(clientIp(request))) {
		return NextResponse.json(
			{ error: 'Слишком много оценок, попробуйте позже' },
			{ status: 429 }
		)
	}

	const { rows } = await db.query<{ rating_sum: number; rating_count: number }>(
		`INSERT INTO tool_stats (tool_id, rating_sum, rating_count) VALUES ($1, $2, 1)
		 ON CONFLICT (tool_id) DO UPDATE SET
		   rating_sum = tool_stats.rating_sum + $2,
		   rating_count = tool_stats.rating_count + 1
		 RETURNING rating_sum, rating_count`,
		[parsed.data.toolId, parsed.data.value]
	)

	const { rating_sum, rating_count } = rows[0]
	return NextResponse.json({
		rating: rating_sum / rating_count,
		ratingCount: rating_count
	})
}
