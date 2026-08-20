import { NextRequest, NextResponse } from 'next/server'
import { getDb, isDbUnavailableError } from '@/lib/db'
import { getWidgetById } from '@/lib/constants/widgets'
import { toolStatsActionSchema } from '@/lib/tool-stats/schema'
import { createRateLimiter } from '@/lib/tool-stats/rate-limit'
import { getAllToolStats } from '@/lib/tool-stats/get-all-stats'
import { sendTelegramMessage } from '@/lib/telegram/proxy-fetch'

// Тот же escapeHtml, что и в app/api/contact и app/api/feedback — parse_mode
// 'HTML' у Telegram сломается или исполнит разметку на необработанном тексте.
const escapeHtml = (value: unknown): string =>
	String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

// Один процесс на контейнер (без serverless, см. CLAUDE.md), поэтому лимитер
// в памяти модуля реально копит историю между запросами.
const rateLimiter = createRateLimiter(20, 60 * 60 * 1000)
// Просмотры — низкая ставка (публичный счётчик на карточках), но без всякой
// защиты скрипт может накрутить любой тул до бесконечности — лимит мягче,
// чем у оценок, но не нулевой.
const viewRateLimiter = createRateLimiter(60, 60 * 60 * 1000)

function clientIp(request: NextRequest): string {
	const forwardedFor = request.headers.get('x-forwarded-for')
	if (forwardedFor) {
		// nginx (см. CLAUDE.md) добавляет реальный IP клиента последним
		// элементом через $proxy_add_x_forwarded_for — всё, что клиент
		// пришлёт в самом заголовке, приписывается ПЕРЕД этим значением и
		// может быть произвольно подделано. Берём только последний элемент —
		// единственный, который контролирует наш прокси, а не клиент.
		const parts = forwardedFor.split(',')
		const last = parts[parts.length - 1]?.trim()
		if (last) return last
	}
	return request.headers.get('x-real-ip') || 'unknown'
}

export async function GET() {
	try {
		const stats = await getAllToolStats()
		return NextResponse.json(stats)
	} catch (error) {
		// БД не поднята (лок. разработка без докера, окружение сборки) —
		// ToolStatsProvider и так трактует пустой ответ как «данных пока
		// нет», так что 500 тут вводит в заблуждение больше, чем помогает.
		if (isDbUnavailableError(error)) {
			return NextResponse.json({})
		}
		console.error('Не удалось получить статистику тулов:', error)
		return NextResponse.json(
			{ error: 'Не удалось получить статистику' },
			{ status: 500 }
		)
	}
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

	if (parsed.data.action === 'view') {
		if (!viewRateLimiter.check(clientIp(request))) {
			return NextResponse.json(
				{ error: 'Слишком много запросов, попробуйте позже' },
				{ status: 429 }
			)
		}

		try {
			const db = await getDb()
			// Оба счётчика инкрементируются ОДНИМ запросом через data-modifying
			// CTE: два отдельных query() — это два автокоммита, и падение
			// второго оставляло tool_stats уже увеличенным, а ответ клиенту —
			// ошибкой. Клиент (lib/hooks/useRecordToolView.ts) в этом случае не
			// ставит флаг дедупликации и присылает просмотр снова, накручивая
			// tool_stats (карточки, aggregateRating) мимо помесячной таблицы.
			// Один запрос = одна неявная транзакция: либо обе строки, либо ни одной.
			// AT TIME ZONE 'UTC' — важно совпадать с currentYearMonth() в
			// lib/tool-stats/tool-of-month.ts, которая тоже считает UTC. Если БД
			// работает в другом часовом поясе сессии, now() без явного UTC даст
			// другую границу месяца и запись уйдёт не в тот year_month.
			const { rows } = await db.query<{ views: string }>(
				`WITH monthly AS (
				   INSERT INTO tool_views_monthly (tool_id, year_month, views)
				   VALUES ($1, to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM'), 1)
				   ON CONFLICT (tool_id, year_month) DO UPDATE
				   SET views = tool_views_monthly.views + 1
				 )
				 INSERT INTO tool_stats (tool_id, views) VALUES ($1, 1)
				 ON CONFLICT (tool_id) DO UPDATE SET views = tool_stats.views + 1
				 RETURNING views`,
				[parsed.data.toolId]
			)
			return NextResponse.json({ views: Number(rows[0].views) })
		} catch (error) {
			if (!isDbUnavailableError(error)) {
				console.error('Не удалось записать просмотр тула:', error)
			}
			return NextResponse.json(
				{ error: 'Не удалось записать просмотр' },
				{ status: 500 }
			)
		}
	}

	if (parsed.data.action === 'feedback') {
		if (!rateLimiter.check(clientIp(request))) {
			return NextResponse.json(
				{ error: 'Слишком много запросов, попробуйте позже' },
				{ status: 429 }
			)
		}

		try {
			const db = await getDb()
			await db.query(
				`INSERT INTO tool_feedback (tool_id, rating, comment) VALUES ($1, $2, $3)`,
				[parsed.data.toolId, parsed.data.rating, parsed.data.comment]
			)

			// БД — гарантированная копия, это уведомление сверху, best-effort.
			// Раньше такие отзывы вообще никуда не попадали, кроме БД, — их
			// приходилось смотреть вручную через psql.
			sendTelegramMessage(
				[
					`⭐ <b>Низкая оценка тула</b>`,
					'',
					`<b>Тул:</b> ${escapeHtml(parsed.data.toolId)}`,
					`<b>Оценка:</b> ${parsed.data.rating}/5`,
					'',
					`<b>Комментарий</b>`,
					escapeHtml(parsed.data.comment)
				].join('\n')
			).catch(telegramError => {
				console.error(
					'Отзыв тула сохранён, но не доставлен в Telegram:',
					telegramError
				)
			})

			return NextResponse.json({ ok: true })
		} catch (error) {
			if (!isDbUnavailableError(error)) {
				console.error('Не удалось сохранить отзыв тула:', error)
			}
			return NextResponse.json(
				{ error: 'Не удалось сохранить отзыв' },
				{ status: 500 }
			)
		}
	}

	if (!rateLimiter.check(clientIp(request))) {
		return NextResponse.json(
			{ error: 'Слишком много оценок, попробуйте позже' },
			{ status: 429 }
		)
	}

	try {
		const db = await getDb()
		const { rows } = await db.query<{
			rating_sum: number
			rating_count: number
		}>(
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
	} catch (error) {
		if (!isDbUnavailableError(error)) {
			console.error('Не удалось сохранить оценку тула:', error)
		}
		return NextResponse.json(
			{ error: 'Не удалось сохранить оценку' },
			{ status: 500 }
		)
	}
}
