import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger-edge';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
  return `rate_limit:${ip}`;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // Allow same-origin requests
  if (origin && host && origin.includes(host)) {
    return true;
  }

  if (referer && host && referer.includes(host)) {
    return true;
  }

  // Allow requests without origin/referer for direct API calls
  if (!origin && !referer) {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitKey = getRateLimitKey(request);
    
    if (!checkRateLimit(rateLimitKey)) {
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const clientIp = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
      
      logger.warn({
        msg: 'Rate limit exceeded',
        ip: clientIp,
        path: pathname,
        userAgent: request.headers.get('user-agent')
      });
      
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Origin/Referer validation for API routes
    if (!validateOrigin(request)) {
      logger.warn({
        msg: 'Invalid origin/referer',
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        path: pathname
      });
      
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      );
    }

    // CSRF protection for state-changing methods
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      // Require JSON content type for API calls (except file uploads)
      if (!contentType?.includes('application/json') && 
          !contentType?.includes('multipart/form-data') &&
          !pathname.includes('/upload')) {
        logger.warn({
          msg: 'Invalid content type for API request',
          contentType,
          method: request.method,
          path: pathname
        });
        
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
      }
    }
  }

  // For protected routes, we'll handle authentication in the page components
  // since Edge Runtime doesn't support NextAuth JWT validation
  const protectedPaths = ['/dashboard', '/profile', '/account'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    // Check if there's a next-auth session token in cookies
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
    
    if (!sessionToken) {
      logger.info({
        msg: 'Unauthorized access attempt to protected route - no session token',
        path: pathname,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      });
      
      return NextResponse.redirect(new URL('/', request.url));
    }

    logger.debug({
      msg: 'Access to protected route with session token',
      path: pathname
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 