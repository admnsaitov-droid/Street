import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { supportedLocales, defaultLocale } from './config/locales';

// Locale list comes from static config — always available in Edge Runtime.
// To add a locale, update src/config/locales.ts.
const handleI18nRouting = createMiddleware({
  locales: supportedLocales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 MIDDLEWARE:', request.nextUrl.pathname);
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)'
  ]
}; 