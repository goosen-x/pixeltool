import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /en, /ru, /rufd)
  const pathname = request.nextUrl.pathname
  
  // Extract the locale from the pathname
  const pathnameLocale = pathname.split('/')[1]
  
  // Check if the pathname starts with a valid locale
  const validLocales = routing.locales
  const isValidLocale = validLocales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  
  // If the pathname starts with an invalid locale pattern (e.g. /rufd, /xyz), 
  // return 404 by rewriting to /_not-found
  if (pathnameLocale && 
      pathnameLocale.length >= 2 && 
      !isValidLocale && 
      pathname !== '/' &&
      !pathname.startsWith('/_') &&
      !pathname.includes('.')) {
    return intlMiddleware(request)
  }
  
  // For all other cases, use the default intl middleware
  return intlMiddleware(request)
}

export const config = {
	// Match all pathnames except for
	// - API routes
	// - Static files (images, fonts, etc.)
	// - Internal Next.js routes
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_not-found).*)'
	]
}
