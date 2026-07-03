import { useLocale } from 'next-intl';

/**
 * Creates a localized URL by prepending the current locale to the path
 * @param path - The path to localize (e.g., '/about', '/products/123')
 * @param locale - The current locale (optional, will use useLocale hook if not provided)
 * @returns The localized path (e.g., '/en/about', '/es/products/123')
 */
export function createLocalizedUrl(path: string, locale?: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If no locale provided, we'll need to get it from the hook
  // This function should be called from within a component that has access to useLocale
  const currentLocale = locale || 'en'; // fallback to 'en' if no locale provided
  
  // Return the localized path
  return `/${currentLocale}/${cleanPath}`;
}

/**
 * Hook to create localized URLs using the current locale
 * @returns A function that creates localized URLs
 */
export function useLocalizedUrl() {
  const locale = useLocale();
  
  return (path: string) => createLocalizedUrl(path, locale);
}

/**
 * Creates a localized URL for external use (when you have the locale but can't use hooks)
 * @param path - The path to localize
 * @param locale - The locale to use
 * @returns The localized path
 */
export function createLocalizedUrlWithLocale(path: string, locale: string): string {
  return createLocalizedUrl(path, locale);
}
