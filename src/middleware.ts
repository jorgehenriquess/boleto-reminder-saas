import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Allow access to public routes
    const publicPaths = [
      '/',
      '/login',
      '/register', 
      '/api/auth',
      '/api/register',
      '/_next',
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml'
    ]
    
    const isPublicPath = publicPaths.some(path => 
      pathname.startsWith(path) || pathname === path
    )

    if (isPublicPath) {
      return NextResponse.next()
    }

    // Get token from the request
    const token = req.nextauth.token

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user has completed onboarding
    if (!token.tenantId && pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    // If user has completed onboarding but tries to access onboarding page
    if (token.tenantId && pathname === '/onboarding') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Add tenant context to headers for API routes
    if (pathname.startsWith('/api/') && token.tenantId) {
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set('x-tenant-id', token.tenantId)
      requestHeaders.set('x-user-id', token.sub!)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public routes without token
        const publicPaths = [
          '/',
          '/login',
          '/register',
          '/api/auth',
          '/api/register'
        ]
        
        const isPublicPath = publicPaths.some(path => 
          pathname.startsWith(path) || pathname === path
        )

        if (isPublicPath) {
          return true
        }

        // For protected routes, require token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}