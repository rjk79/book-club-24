import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up');

    if (req.url.endsWith('/api/getRec')) {
      const { ip, nextUrl } = req;
      nextUrl.searchParams.set('clientIp', ip as any);
      return NextResponse.rewrite(nextUrl);
    }

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/books', req.url));
      }

      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return null;
  },
  {
    callbacks: {
      async authorized({ token, req }) {
        // makes middleware func always happen when accessing auth pages and not logged in
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/api/getRec', '/books', '/book/:path*', '/create-book', '/sign-in', '/sign-up']
};
