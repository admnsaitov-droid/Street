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
    
    console.log('Middleware - available locales from Strapi:', locales);
    console.log('Middleware - default locale from Strapi:', defaultLocale);

    // Get safe locales from environment variable or fallback to Strapi
    const envLocales = process.env.NEXT_PUBLIC_LOCALES?.split(',').map(l => l.trim()) || [];
    const envDefaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
    
    // Use env locales if available, otherwise use Strapi locales, with final fallback
    const safeLocales = envLocales.length > 0 ? envLocales : (locales.length > 0 ? locales : ['en', 'es']);
    const safeDefaultLocale = envLocales.length > 0 ? envDefaultLocale : (defaultLocale || 'en');

    console.log('Middleware - FORCED locales:', safeLocales);
    console.log('Middleware - FORCED default locale:', safeDefaultLocale);

    // Create the middleware with forced configuration
    const handleI18nRouting = createMiddleware({
      locales: safeLocales,
      defaultLocale: safeDefaultLocale,
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