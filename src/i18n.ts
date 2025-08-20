import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getLocaleCodes } from './utils/locales';

export default getRequestConfig(async ({ requestLocale }) => {
//   console.log('i18n config - requestLocale received:', await requestLocale);
  
  // Get dynamic locales from Strapi
  const locales = await getLocaleCodes();
  
  // Get the requested locale or fallback to first available
  const locale = (await requestLocale) || locales[0] || 'en';
  
//   console.log('i18n config - available locales:', locales);
//   console.log('i18n config - final locale:', locale);
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  // No messages needed - all content comes from Strapi
  const messages = {};
  
  return {
    locale,
    messages
  };
});

// Export function to get locales for use in other files
export { getLocaleCodes, getDefaultLocale, getStrapiLocales } from './utils/locales'; 