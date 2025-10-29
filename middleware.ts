import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle /page/* routes - redirect to dynamic route
  // This catches URLs like /page/Elon_Musk or /page/Tiger_Woods
  if (pathname.startsWith('/page/')) {
    // The route already exists at app/page/[...slug]/page.tsx
    // Just pass through
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/page/:path*',
  ],
};

