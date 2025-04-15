import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/supabase'

// Simple function to extract cookies
function getCookie(request: NextRequest, name: string) {
  const cookie = request.cookies.get(name);
  return cookie?.value;
}

// Extract auth token from header or cookie
function extractToken(req: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  
  // Fallback to cookie
  const cookieToken = getCookie(req, 'sb-access-token');
  return cookieToken || null;
}

export async function middleware(req: NextRequest) {
  // Check for the no-redirect flag to break loops
  if (getCookie(req, 'no_redirect') === 'true') {
    console.log('No-redirect cookie found, allowing access');
    return NextResponse.next();
  }

  console.log('Middleware starting for path:', req.nextUrl.pathname);
  
  // Create a response to modify
  const res = NextResponse.next();
  
  try {
    // Extract token from request
    const token = extractToken(req);
    
    // Verify token if present using the centralized utility
    const userId = token ? await verifyToken(token) : null;
    const isAuthenticated = !!userId;
    
    console.log('Middleware auth check:', {
      path: req.nextUrl.pathname,
      hasToken: !!token,
      isAuthenticated,
      userId: userId || 'none'
    });

    // Need to protect tasks routes
    if (!isAuthenticated && req.nextUrl.pathname.startsWith('/tasks')) {
      console.log('Access denied - redirecting to home page');
      
      // Set a cookie to prevent redirect loops when redirecting
      const redirectUrl = new URL('/', req.url);
      redirectUrl.searchParams.set('auth', 'required');
      
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('no_redirect', 'true', { 
        path: '/',
        maxAge: 5  // Very short-lived cookie
      });
      
      return response;
    }

    // If authenticated
    if (isAuthenticated) {
      console.log('Valid authentication, allowing access to:', req.nextUrl.pathname);
    }
    
    // Continue with the response
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request through to prevent blocking valid access
    return NextResponse.next();
  }
}

// Specify which paths this middleware should run on
export const config = {
  matcher: ['/tasks/:path*'],
}
