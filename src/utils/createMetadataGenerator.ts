/**
 * @fileoverview Helper utility to create metadata generators for pages with locale support
 * 
 * This utility provides a standardized way to generate metadata for pages that need
 * locale-aware URLs and metadata. It handles:
 * 1. Locale parameter extraction
 * 2. URL construction with locale prefix
 * 3. Locale format conversion for OpenGraph
 * 4. Error handling with fallbacks
 * 
 * @example
 * ```typescript
 * // Simple page with only locale
 * export const generateMetadata = createMetadataGenerator({
 *   getMetadata: async (locale) => {
 *     const data = await getStrapiData('get-about', locale);
 *     return data?.metadata;
 *   },
 *   getPath: (locale) => `/${locale}/about`,
 *   fallback: {
 *     title: 'About Us',
 *     description: 'Learn more about us'
 *   }
 * });
 * 
 * // Dynamic page with additional parameters
 * export const generateMetadata = createMetadataGenerator({
 *   getMetadata: async (locale, slug) => {
 *     const data = await getStrapiData(`get-product-data?slug=${slug}`, locale);
 *     return data?.metadata;
 *   },
 *   getPath: (locale, slug) => `/${locale}/products/${slug}`,
 *   fallback: {
 *     title: 'Product',
 *     description: 'Product details'
 *   }
 * });
 * ```
 */

import { Metadata } from "next";
import { generateMetadata as baseGenerateMetadata } from "./generateMetadata";
import { generateHreflangTags } from "./generateHreflangTags";

interface MetadataConfig {
  getMetadata?: (locale: string, ...args: any[]) => Promise<any>;
  getPath: (locale: string, ...args: any[]) => string;
  fallback: {
    title: string;
    description: string;
    keywords?: string;
  };
  // Optional transformer to extract metadata from different data structures
  transformData?: (data: any) => any;
  ogType?: 'website' | 'article';
  // When true, the global " | Street Barbell" brand suffix is not appended (e.g. Home).
  skipBrandSuffix?: boolean;
}

/**
 * Creates a metadata generator function for a specific page
 * @param config Configuration object with metadata fetching logic and fallbacks
 * @returns generateMetadata function that can be exported from page components
 */
export function createMetadataGenerator(config: MetadataConfig) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string; [key: string]: string }>;
  }): Promise<Metadata> {
    const resolvedParams = await params;
    const { locale, ...otherParams } = resolvedParams;
    const additionalArgs = Object.values(otherParams);
    
    try {
      let metadata = null;
      
      // Fetch metadata if a getter function is provided
      if (config.getMetadata) {
        try {
          const data = await config.getMetadata(locale, ...additionalArgs);
          // Apply custom data transformer if provided, otherwise use default logic
          if (config.transformData) {
            metadata = config.transformData(data);
          } else {
            metadata = data?.metadata || data;
          }
        } catch (metadataError) {
          console.error(`Error fetching metadata for ${config.getPath(locale, ...additionalArgs)}:`, metadataError);
          metadata = null;
        }
      }

      // Construct URL with locale
      const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com';
      const path = config.getPath(locale, ...additionalArgs);
      const fullUrl = `${baseUrl}${path}`;
      
      // Generate hreflang tags for internationalization
      const pathWithoutLocale = path.replace(`/${locale}`, '') || '/';
      const hreflangTags = await generateHreflangTags({
        path: pathWithoutLocale,
        currentLocale: locale,
        baseUrl,
      });

      const generatedMetadata = baseGenerateMetadata({
        title: metadata?.metatitle || config.fallback.title,
        description: metadata?.metadescription || config.fallback.description,
        keywords: metadata?.metakeywords || config.fallback.keywords,
        url: fullUrl,
        ogImage: metadata?.openGraph ? `/api/media${metadata.openGraph.url}` : undefined,
        locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
        ogType: config.ogType,
        skipBrand: config.skipBrandSuffix,
      });
      
      // Add hreflang tags to alternates
      if (generatedMetadata.alternates) {
        generatedMetadata.alternates.languages = hreflangTags;
      }
      
      return generatedMetadata;
    } catch (error) {
      console.error(`Error generating metadata for ${config.getPath(locale, ...additionalArgs)}:`, error);
      
      // Fallback metadata with locale-aware URL and hreflang
      const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com';
      const path = config.getPath(locale, ...additionalArgs);
      const fullUrl = `${baseUrl}${path}`;
      
      // Generate hreflang tags for fallback as well
      const pathWithoutLocale = path.replace(`/${locale}`, '') || '/';
      const hreflangTags = await generateHreflangTags({
        path: pathWithoutLocale,
        currentLocale: locale,
        baseUrl,
      });
      
      const fallbackMetadata = baseGenerateMetadata({
        title: config.fallback.title,
        description: config.fallback.description,
        keywords: config.fallback.keywords,
        url: fullUrl,
        locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
        skipBrand: config.skipBrandSuffix,
      });
      
      // Add hreflang tags to alternates
      if (fallbackMetadata.alternates) {
        fallbackMetadata.alternates.languages = hreflangTags;
      }
      
      return fallbackMetadata;
    }
  };
}