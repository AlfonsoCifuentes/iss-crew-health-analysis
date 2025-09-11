import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers for better Core Web Vitals
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Add performance hints
  response.headers.set(
    'Link', 
    '</data/real_metrics.json>; rel=preload; as=fetch; crossorigin=anonymous, ' +
    '</data/aggregated_stats.json>; rel=preload; as=fetch; crossorigin=anonymous, ' +
    '</data/model_metadata.json>; rel=preload; as=fetch; crossorigin=anonymous'
  )

  // Enable compression
  response.headers.set('Content-Encoding', 'gzip')
  
  // Cache static assets
  if (request.nextUrl.pathname.startsWith('/data/') || 
      request.nextUrl.pathname.startsWith('/images/') ||
      request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=43200'
    )
  }

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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
