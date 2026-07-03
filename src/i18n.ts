import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getLocaleCodes } from './utils/locales';
import { supportedLocales } from './config/locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Mirror the middleware: prefer NEXT_PUBLIC_LOCALES env var, only call Strapi as fallback.
  // This ensures both middleware and i18n config agree on which locales are valid,
  // which prevents 404s on localhost when Strapi is slow or returns incomplete data.
  const envLocales = process.env.NEXT_PUBLIC_LOCALES?.split(',').map(l => l.trim()).filter(Boolean) || [];

  let safeLocales: string[];
  if (envLocales.length > 0) {
    safeLocales = envLocales;
  } else {
    // Fall back to static config (always reliable, no env var or Strapi needed)
    const locales = await getLocaleCodes();
    safeLocales = locales && locales.length > 0 ? locales : [...supportedLocales];
  }

  const finalLocale = locale || safeLocales[0] || 'en';

  if (!safeLocales.includes(finalLocale)) {
    notFound();
  }

  return {
    locale: finalLocale,
    messages: {}
  };
});

// Export function to get locales for use in other files
export { getLocaleCodes, getDefaultLocale, getStrapiLocales } from './utils/locales'; 