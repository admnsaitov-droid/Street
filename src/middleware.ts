import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { supportedLocales, defaultLocale } from './config/locales';
import { isBotUserAgent } from './utils/isBot';
import { ROBOT_FETCH_HEADER, robotDevice } from './utils/robotDocument';

// Locale list comes from static config — always available in Edge Runtime.
// To add a locale, update src/config/locales.ts.
const handleI18nRouting = createMiddleware({
  locales: supportedLocales,
  defaultLocale,
  localePrefix: 'always',
});

const HOME = new RegExp(`^/(${supportedLocales.join('|')})/?$`);
const ROBOT_VIEW = new RegExp(`^/(${supportedLocales.join('|')})/robot-view(/|$)`);

export default function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 MIDDLEWARE:', request.nextUrl.pathname);
  }
  const { pathname } = request.nextUrl;

  // Robots (crawlers, Lighthouse, PageSpeed) get the home page's robot form:
  // the same content at rest, without scripts (ADR-0121). Same URL — a rewrite.
  const home = pathname.match(HOME);
  if (home && isBotUserAgent(request.headers.get('user-agent'))) {
    const device = robotDevice(request.headers.get('user-agent'));
    return NextResponse.rewrite(new URL(`/robot-doc/${home[1]}/${device}`, request.url));
  }

  // The at-rest render is for /robot-doc's own fetch only; people go home.
  // (Bots may land here too: /robot-doc's fallback when its fetch fails.)
  const robotView = pathname.match(ROBOT_VIEW);
  if (robotView && request.headers.get(ROBOT_FETCH_HEADER) !== '1' && !isBotUserAgent(request.headers.get('user-agent'))) {
    return NextResponse.redirect(new URL(`/${robotView[1]}`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|robot-doc|favicon.ico|.*\\..*).*)'
  ]
};
