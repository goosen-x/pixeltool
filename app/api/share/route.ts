import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb, isDbUnavailableError } from '@/lib/db'
import { getWidgetById } from '@/lib/constants/widgets'
import { getPostSlugs } from '@/lib/api-file'
import { hashIp } from '@/lib/tool-stats/vote-log'
import { createRateLimiter } from '@/lib/tool-stats/rate-limit'

// Нажатия «Поделиться»: какой тул или статью и куда. Счётчик не публичный,
// его читает ночной разбор Goose Radar, поэтому лимит мягкий — только от скрипта.
const schema = z.object({
	kind: z.enum(['tool', 'blog']),
	targetId: z.string().min(1).max(200),
	network: z.enum(['telegram', 'whatsapp', 'vk', 'copy'])
})

const rateLimiter = createRateLimiter(30, 60 * 60 * 1000)

function clientIp(request: NextRequest): string {
	// Последний элемент x-forwarded-for ставит наш nginx, остальное мог прислать клиент
	const last = request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
	return last || request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
	const parsed = schema.safeParse(await request.json().catch(() => null))
	if (!parsed.success) {
		return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
	}
	const { kind, targetId, network } = parsed.data
	const exists =
		kind === 'tool'
			? Boolean(getWidgetById(targetId))
			: getPostSlugs().some(file => file.replace(/\.md$/, '') === targetId)
	if (!exists) {
		return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
	}
	const ip = clientIp(request)
	if (!rateLimiter.check(ip)) {
		return NextResponse.json({ error: 'Слишком часто' }, { status: 429 })
	}
	try {
		const db = await getDb()
		await db.query(
			`INSERT INTO share_clicks (kind, target_id, network, ip_hash) VALUES ($1, $2, $3, $4)`,
			[kind, targetId, network, ip === 'unknown' ? null : hashIp(ip)]
		)
		return NextResponse.json({ ok: true })
	} catch (error) {
		if (isDbUnavailableError(error)) return NextResponse.json({ ok: false })
		console.error('Нажатие «Поделиться» не записано:', error)
		return NextResponse.json({ error: 'Ошибка записи' }, { status: 500 })
	}
}
