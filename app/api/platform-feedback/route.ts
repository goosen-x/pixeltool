import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb, isDbUnavailableError } from '@/lib/db'
import { getWidgetById } from '@/lib/constants/widgets'
import { createRateLimiter } from '@/lib/tool-stats/rate-limit'

// Один тап без подтверждения — та же частота использования, что у звезды
// рейтинга, поэтому и лимит скопирован с rateLimiter из app/api/tool-stats.
const rateLimiter = createRateLimiter(20, 60 * 60 * 1000)

const platformFeedbackSchema = z.object({
	toolId: z.string().min(1),
	platformId: z.string().min(1),
	charId: z.string().min(1),
	works: z.boolean()
})

function clientIp(request: NextRequest): string {
	const forwardedFor = request.headers.get('x-forwarded-for')
	if (forwardedFor) {
		const parts = forwardedFor.split(',')
		const last = parts[parts.length - 1]?.trim()
		if (last) return last
	}
	return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
	let body: unknown

	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
	}

	const parsed = platformFeedbackSchema.safeParse(body)
	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })
	}

	if (!getWidgetById(parsed.data.toolId)) {
		return NextResponse.json({ error: 'Тул не найден' }, { status: 404 })
	}

	if (!rateLimiter.check(clientIp(request))) {
		return NextResponse.json(
			{ error: 'Слишком много запросов, попробуйте позже' },
			{ status: 429 }
		)
	}

	try {
		const db = await getDb()
		// Сырой лог и агрегат пишутся одним запросом через data-modifying CTE —
		// та же причина, что у tool_views_monthly + tool_stats в
		// app/api/tool-stats: два отдельных query() это два автокоммита, и
		// падение второго рассинхронит счётчик с логом. RETURNING сразу
		// отдаёт актуальные works_count/broken_count — второй GET не нужен.
		const { rows } = await db.query<{
			works_count: number
			broken_count: number
		}>(
			`WITH logged AS (
			   INSERT INTO platform_feedback (tool_id, platform_id, char_id, works)
			   VALUES ($1, $2, $3, $4)
			 )
			 INSERT INTO platform_feedback_stats (tool_id, platform_id, works_count, broken_count)
			 VALUES ($1, $2, CASE WHEN $4 THEN 1 ELSE 0 END, CASE WHEN $4 THEN 0 ELSE 1 END)
			 ON CONFLICT (tool_id, platform_id) DO UPDATE SET
			   works_count = platform_feedback_stats.works_count + CASE WHEN $4 THEN 1 ELSE 0 END,
			   broken_count = platform_feedback_stats.broken_count + CASE WHEN $4 THEN 0 ELSE 1 END
			 RETURNING works_count, broken_count`,
			[
				parsed.data.toolId,
				parsed.data.platformId,
				parsed.data.charId,
				parsed.data.works
			]
		)
		return NextResponse.json({
			works: Number(rows[0].works_count),
			broken: Number(rows[0].broken_count)
		})
	} catch (error) {
		if (!isDbUnavailableError(error)) {
			console.error('Не удалось сохранить оценку площадки:', error)
		}
		return NextResponse.json(
			{ error: 'Не удалось отправить оценку' },
			{ status: 500 }
		)
	}
}

export async function GET(request: NextRequest) {
	const toolId = request.nextUrl.searchParams.get('toolId')
	if (!toolId) {
		return NextResponse.json({ error: 'Не передан toolId' }, { status: 400 })
	}

	try {
		const db = await getDb()
		const { rows } = await db.query<{
			platform_id: string
			works_count: number
			broken_count: number
		}>(
			`SELECT platform_id, works_count, broken_count
			 FROM platform_feedback_stats
			 WHERE tool_id = $1`,
			[toolId]
		)

		const stats: Record<string, { works: number; broken: number }> = {}
		for (const row of rows) {
			stats[row.platform_id] = {
				works: Number(row.works_count),
				broken: Number(row.broken_count)
			}
		}
		return NextResponse.json(stats)
	} catch (error) {
		// БД не поднята (лок. разработка без докера) — грид и так рендерится
		// без чисел, пустой ответ тут не вводит в заблуждение больше 500-й.
		if (isDbUnavailableError(error)) {
			return NextResponse.json({})
		}
		console.error('Не удалось получить статистику площадок:', error)
		return NextResponse.json(
			{ error: 'Не удалось получить статистику' },
			{ status: 500 }
		)
	}
}
