import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { getLocaleCodes, getDefaultLocale } from './utils/locales';

// Create middleware with dynamic locale configuration
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Enable logging in production to debug Vercel issues
  console.log('🔥 MIDDLEWARE - incoming request:', pathname);
  console.log(`🔍 COOKIES: ${request.cookies.get('NEXT_LOCALE')?.value || 'none'}`);
  
  try {
    // Get dynamic locales from Strapi
    const locales = await getLocaleCodes();
    const defaultLocale = await getDefaultLocale();
    
    console.log('Middleware - available locales:', locales);
    console.log('Middleware - default locale:', defaultLocale);

    // Validate that we have locales before proceeding
    if (!locales || locales.length === 0) {
      throw new Error('No locales available');
    }

    // Create the middleware with dynamic configuration
    const handleI18nRouting = createMiddleware({
      locales,
      defaultLocale,
      localePrefix: 'always'
    });

    const response = handleI18nRouting(request);
    
    // Log what the middleware decided to do
    if (response && response.headers.get('x-middleware-rewrite')) {
      console.log(`🔄 REWRITE TO: ${response.headers.get('x-middleware-rewrite')}`);
    }
    if (response && response.headers.get('location')) {
      console.log(`🔄 REDIRECT TO: ${response.headers.get('location')}`);
    }
    
    return response;
  } catch (error) {
    console.error('🚨 Error in middleware:', error);
    
    // Fallback to basic configuration if Strapi is not available
    // console.log('🔄 Using fallback middleware configuration');
    const fallbackMiddleware = createMiddleware({
      locales: ['en', 'es'], // Add common locales as fallback
      defaultLocale: 'en',
      localePrefix: 'always'
    });

    return fallbackMiddleware(request);
  }
}

export const config = {
  // Match only internationalized pathnames  
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)' 
  ]
}; 