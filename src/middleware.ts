import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, allow all dashboard requests through
  // The auth check will happen server-side in the dashboard pages
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

export const runtime = 'nodejs';
