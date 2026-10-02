import { CONTENT_CACHE_TAG, CONTENT_REVALIDATE } from "@/config/cache";

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>();

const REQUEST_TIMEOUT_MS = 10000;

export const getStrapiData = async (path: string, locale?: string) => {
    try {
      const baseUrl = getBaseUrl();

      // Get current locale if not provided
      // If no locale is provided, we'll default to 'en' for client-side calls
      const currentLocale = locale || 'en';

      // Add locale parameter to the path
      const separator = path.includes('?') ? '&' : '?';
      const localeParam = `${separator}locale=${currentLocale}`;
      const pathWithLocale = `${path}${localeParam}`;

      // Create cache key for deduplication
      const cacheKey = `${baseUrl}/api/${pathWithLocale}`;

      // Check if request is already in progress
      if (requestCache.has(cacheKey)) {
        return await requestCache.get(cacheKey);
      }

      // AbortController rather than AbortSignal.timeout(): this also runs in
      // the browser (Header/Footer/menus), and Safari < 16 lacks the latter.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      // `fetch`, not axios: on the server it goes through the Next data cache,
      // so a page render reuses the response instead of a fresh round trip to
      // /api and on to Strapi (ADR-0117). In the browser `next` is ignored.
      const isServer = typeof window === 'undefined';
      const doFetch = () => fetch(cacheKey, {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        ...(isServer
          ? { next: { revalidate: CONTENT_REVALIDATE, tags: [CONTENT_CACHE_TAG] } }
          : {}),
      });
      // Server-side self-calls go out through the CDN, which intermittently
      // drops a TLS handshake; retry a connection failure once (not an abort).
      const requestPromise = doFetch().catch((error) => {
        if (!isServer || controller.signal.aborted) throw error;
        return doFetch();
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`${response.status} for ${cacheKey}`);
        }
        return response.json();
      }).finally(() => {
        clearTimeout(timer);
        // Remove from the in-flight map once settled
        requestCache.delete(cacheKey);
      });

      // Cache the request
      requestCache.set(cacheKey, requestPromise);

      return await requestPromise;
    } catch (error) {
      console.error('Error getting strapi data:', error);

      // Return null instead of throwing to prevent page crashes
      // Pages should handle null data gracefully
      return null;
    }
};

const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        // Server-side - use the same env var as other parts of the app
        return process.env.NEXT_PUBLIC_BASEURL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }
    // Client-side
    return window.location.origin;
};
