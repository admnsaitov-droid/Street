/**
 * @fileoverview Utility to generate hreflang alternate tags for internationalization
 * 
 * This utility generates hreflang tags for all supported locales of a page:
 * 1. Creates language alternates for each locale
 * 2. Sets x-default to the default locale (usually 'en')
 * 3. Constructs proper URLs with locale prefixes
 * 
 * @example
 * const hreflangTags = await generateHreflangTags('/about', 'en')
 * // Returns:
 * // {
 * //   'en': 'https://example.com/en/about',
 * //   'es': 'https://example.com/es/about', 
 * //   'x-default': 'https://example.com/en/about'
 * // }
 */

import { getLocaleCodes } from './locales'

interface HreflangOptions {
  /**
   * The path without locale prefix (e.g., '/about', '/products/123')
   */
  path: string
  
  /**
   * Current page locale
   */
  currentLocale: string
  
  /**
   * Base URL for the site (defaults to NEXT_PUBLIC_BASEURL or fallback)
   */
  baseUrl?: string
  
  /**
   * Default locale for x-default tag (defaults to 'en')
   */
  defaultLocale?: string
}

export async function generateHreflangTags({
  path,
  currentLocale,
  baseUrl,
  defaultLocale = 'en'
}: HreflangOptions): Promise<Record<string, string>> {
  const locales = await getLocaleCodes()
  const finalBaseUrl = baseUrl || process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'
  
  const hreflangTags: Record<string, string> = {}
  
  // Generate hreflang for each supported locale
  for (const locale of locales) {
    const url = `${finalBaseUrl}/${locale}${path}`
    hreflangTags[locale] = url
  }
  
  // Set x-default to the default locale
  if (locales.includes(defaultLocale)) {
    hreflangTags['x-default'] = `${finalBaseUrl}/${defaultLocale}${path}`
  }
  
  return hreflangTags
}
