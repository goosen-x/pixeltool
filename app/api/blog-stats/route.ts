import { NextRequest, NextResponse } from 'next/server'
import { getDb, isDbUnavailableError } from '@/lib/db'
import { getPostSlugs } from '@/lib/api-file'
import { blogStatsActionSchema } from '@/lib/blog-stats/schema'
import { createRateLimiter } from '@/lib/tool-stats/rate-limit'

const rateLimiter = createRateLimiter(20, 60 * 60 * 1000)
const viewRateLimiter = createRateLimiter(60, 60 * 60 * 1000)

function clientIp(request: NextRequest): string {
	const forwardedFor = request.headers.get('x-forwarded-for')
	if (forwardedFor) {
		const parts = forwardedFor.split(',')
		const last = parts[parts.length - 1]?.trim()
		if (last) return last
	}
	return request.headers.get('x-real-ip') || 'unknown'
}

function postExists(postId: string): boolean {
	return getPostSlugs().some(file => file.replace(/\.md$/, '') === postId)
}

export async function GET(request: NextRequest) {
	const postId = request.nextUrl.searchParams.get('postId')
	if (!postId) {
		return NextResponse.json({ error: 'Не указан postId' }, { status: 400 })
	}

	try {
		const db = await getDb()
		const { rows } = await db.query<{
			views: string
			rating_sum: number
			rating_count: number
		}>(
			'SELECT views, rating_sum, rating_count FROM blog_stats WHERE post_id = $1',
			[postId]
		)

		const row = rows[0]
		return NextResponse.json({
			views: row ? Number(row.views) : 0,
			rating:
				row && row.rating_count > 0 ? row.rating_sum / row.rating_count : 0,
			ratingCount: row?.rating_count ?? 0
		})
	} catch (error) {
		if (isDbUnavailableError(error)) {
			return NextResponse.json({ views: 0, rating: 0, ratingCount: 0 })
		}
		console.error('Не удалось получить статистику статьи:', error)
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

	const parsed = blogStatsActionSchema.safeParse(body)
	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })
	}

	if (!postExists(parsed.data.postId)) {
		return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 })
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
			const { rows } = await db.query<{ views: string }>(
				`INSERT INTO blog_stats (post_id, views) VALUES ($1, 1)
				 ON CONFLICT (post_id) DO UPDATE SET views = blog_stats.views + 1
				 RETURNING views`,
				[parsed.data.postId]
			)
			return NextResponse.json({ views: Number(rows[0].views) })
		} catch (error) {
			if (!isDbUnavailableError(error)) {
				console.error('Не удалось записать просмотр статьи:', error)
			}
			return NextResponse.json(
				{ error: 'Не удалось записать просмотр' },
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
			`INSERT INTO blog_stats (post_id, rating_sum, rating_count) VALUES ($1, $2, 1)
			 ON CONFLICT (post_id) DO UPDATE SET
			   rating_sum = blog_stats.rating_sum + $2,
			   rating_count = blog_stats.rating_count + 1
			 RETURNING rating_sum, rating_count`,
			[parsed.data.postId, parsed.data.value]
		)

		const { rating_sum, rating_count } = rows[0]
		return NextResponse.json({
			rating: rating_sum / rating_count,
			ratingCount: rating_count
		})
	} catch (error) {
		if (!isDbUnavailableError(error)) {
			console.error('Не удалось сохранить оценку статьи:', error)
		}
		return NextResponse.json(
			{ error: 'Не удалось сохранить оценку' },
			{ status: 500 }
		)
	}
}
