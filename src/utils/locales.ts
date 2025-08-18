import axios from 'axios';

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
    // Fallback locales if Strapi is not available
    const fallbackLocales = [
      { id: 1, localeCode: 'en', localeName: 'English' }
    ];
    cachedStrapiLocales = fallbackLocales;
    return fallbackLocales;
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