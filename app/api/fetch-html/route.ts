import { NextRequest, NextResponse } from 'next/server'
import { toSafePublicUrl } from '@/lib/security/ssrf'

/**
 * Скачивает HTML страницы по адресу и отдаёт как текст.
 *
 * Живёт на сервере, потому что из браузера чужую страницу не забрать — CORS её
 * режет. Адрес приходит от пользователя, поэтому роут защищён от SSRF
 * (см. lib/security/ssrf): без этого через него можно было бы сходить на
 * localhost или на метаданные облака.
 */

const FETCH_TIMEOUT_MS = 10000
/** Дерево строится в браузере — гигантские страницы туда тащить незачем. */
const MAX_HTML_BYTES = 3 * 1024 * 1024

export async function GET(request: NextRequest) {
	const input = request.nextUrl.searchParams.get('url')

	if (!input) {
		return NextResponse.json({ error: 'Не передан адрес' }, { status: 400 })
	}

	let target: URL
	try {
		target = await toSafePublicUrl(input)
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Некорректный адрес'
		return NextResponse.json({ error: message }, { status: 400 })
	}

	try {
		const response = await fetch(target.toString(), {
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PixelTool/1.0)' }
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Сайт ответил ${response.status}` },
				{ status: 400 }
			)
		}

		const type = response.headers.get('content-type') ?? ''
		if (!/text\/html|application\/xhtml|text\/xml|application\/xml/i.test(type)) {
			return NextResponse.json(
				{ error: 'По адресу не HTML-страница' },
				{ status: 400 }
			)
		}

		const html = (await response.text()).slice(0, MAX_HTML_BYTES)
		return NextResponse.json({ html, url: response.url || target.toString() })
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'TimeoutError'
				? 'Сайт слишком долго не отвечает'
				: 'Не удалось получить страницу'
		return NextResponse.json({ error: message }, { status: 502 })
	}
}
