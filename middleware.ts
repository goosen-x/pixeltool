import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
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
