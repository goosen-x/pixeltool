import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Основной домен — pxtool.ru. Старый домен pixeltool.pro 301-редиректим на него.
const LEGACY_HOSTS = new Set(['pixeltool.pro', 'www.pixeltool.pro'])

export function middleware(request: NextRequest) {
	const host = request.headers.get('host')?.split(':')[0] ?? ''

	// 301-редирект с устаревшего домена на основной, сохраняя путь и query-параметры
	if (LEGACY_HOSTS.has(host)) {
		const url = request.nextUrl.clone()
		url.protocol = 'https:'
		url.hostname = 'pxtool.ru'
		url.port = ''
		return NextResponse.redirect(url, 301)
	}

	// Force dynamic rendering for all pages to prevent useSearchParams build errors
	const response = NextResponse.next()

	// Set headers to force dynamic rendering
	response.headers.set('x-middleware-cache', 'no-cache')
	response.headers.set('cache-control', 'no-store, must-revalidate')

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)'
	]
}
