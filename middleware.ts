import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Force dynamic rendering for all /tools/* pages to prevent useSearchParams build errors
  if (request.nextUrl.pathname.startsWith('/tools/')) {
    const response = NextResponse.next()
    
    // Set headers to force dynamic rendering
    response.headers.set('x-middleware-cache', 'no-cache')
    response.headers.set('cache-control', 'no-store, must-revalidate')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/tools/:path*'
}