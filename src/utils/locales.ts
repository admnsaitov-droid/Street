import axios from 'axios';
import { supportedLocales } from '@/config/locales';

export interface StrapiLocale {
  id: number;
  localeCode: string;
  localeName: string;
}

// Cache for locales to avoid repeated API calls
let cachedLocales: string[] | null = null;
let cachedStrapiLocales: StrapiLocale[] | null = null;

export async function getStrapiLocales(): Promise<StrapiLocale[]> {
  if (cachedStrapiLocales) {
    return cachedStrapiLocales;
  }

  try {
    const response = await axios.get(
      `${process.env.API_URL}/api/header?populate[locales][populate]=*`,
      {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 3000 // 3 second timeout
      }
    );
    
    const locales = response.data?.data?.locales || [];
    cachedStrapiLocales = locales;
    return locales;
  } catch (error) {
    console.error('Error fetching locales from Strapi:', error);
    // Fall back to the static config (all five locales), and do NOT memoise
    // it: caching a failure here used to pin the process to ['en'] until the
    // next restart, silently dropping four locales from the sitemap and
    // generateStaticParams after one slow Strapi response.
    return supportedLocales.map((localeCode, index) => ({
      id: index + 1,
      localeCode,
      localeName: localeCode,
    }));
  }
}

export async function getLocaleCodes(): Promise<string[]> {
  if (cachedLocales) {
    return cachedLocales;
  }

  const strapiLocales = await getStrapiLocales();
  const codes = strapiLocales.map(locale => locale.localeCode);
  cachedLocales = codes;
  return codes;
}

export async function getDefaultLocale(): Promise<string> {
  const codes = await getLocaleCodes();
  return codes[0] || 'en';
}

export function clearLocaleCache() {
  cachedLocales = null;
  cachedStrapiLocales = null;
} 