import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/agency/sign-in(.*)',
  '/agency/sign-up(.*)',
  '/site',
  '/api/uploadthing'
]);

const validStaticRoutes = [
  '/', '/site', '/about', '/dashboard', '/api/uploadthing',
  '/agency/sign-in', '/agency/sign-up', '/agency/forgot-password',
];

async function isValidRoute(pathname: string): Promise<boolean> {
  if (validStaticRoutes.includes(pathname)) return true;
  if (pathname.startsWith('/user/')) return true;
  return false;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const url = new URL(req.url);
  const redirectUrlParam = url.searchParams.get('redirect_url');
  let redirectPath = req.nextUrl.pathname + req.nextUrl.search;

  // Handle private routes
  if (!isPublicRoute(req)) {
    if (!userId) {
      if (redirectUrlParam) {
        const decodedPath = decodeURIComponent(redirectUrlParam);
        if (await isValidRoute(decodedPath)) {
          redirectPath = decodedPath;
        } else {
          redirectPath = '/site';
        }
      }

      return NextResponse.redirect(
        new URL(`/agency/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`, req.url)
      );
    }
  }

  // Optionally, redirect signed-in users from `/` to `/site`
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/site', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
