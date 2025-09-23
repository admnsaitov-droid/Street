import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { getLocaleCodes, getDefaultLocale } from './utils/locales';

// Create middleware with optimized locale configuration
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Reduce logging in production for better performance
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 MIDDLEWARE - incoming request:', pathname);
    console.log(`🔍 COOKIES: ${request.cookies.get('NEXT_LOCALE')?.value || 'none'}`);
  }
  
  try {
    // Priority: Use environment variables first (faster than Strapi calls)
    const envLocales = process.env.NEXT_PUBLIC_LOCALES?.split(',').map(l => l.trim()) || [];
    const envDefaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
    
    let safeLocales = envLocales;
    let safeDefaultLocale = envDefaultLocale;
    
    // Only call Strapi if env variables are not set
    if (envLocales.length === 0) {
      const [locales, defaultLocale] = await Promise.all([
        getLocaleCodes(),
        getDefaultLocale()
      ]);
      
      safeLocales = locales.length > 0 ? locales : ['en', 'es'];
      safeDefaultLocale = defaultLocale || 'en';
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Middleware - fetched from Strapi:', { safeLocales, safeDefaultLocale });
      }
    }

    // Create the middleware with optimized configuration
    const handleI18nRouting = createMiddleware({
      locales: safeLocales,
      defaultLocale: safeDefaultLocale,
      localePrefix: 'always'
    });

    const response = handleI18nRouting(request);
    
    // Minimal logging in production
    if (process.env.NODE_ENV === 'development' && response) {
      if (response.headers.get('x-middleware-rewrite')) {
        console.log(`🔄 REWRITE TO: ${response.headers.get('x-middleware-rewrite')}`);
      }
      if (response.headers.get('location')) {
        console.log(`🔄 REDIRECT TO: ${response.headers.get('location')}`);
      }
    }
    
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error in middleware:', error);
    }
    
    // Fast fallback without logging
    const fallbackMiddleware = createMiddleware({
      locales: ['en', 'es'],
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