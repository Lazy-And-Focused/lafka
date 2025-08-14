import { NextResponse, type NextRequest } from 'next/server';

import { getUser } from './shared/user';

// Вынесите в отдельный файл
const AUTH_PATH = '/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== AUTH_PATH) return;

  const user = await getUser();
  if (!user) return;

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
