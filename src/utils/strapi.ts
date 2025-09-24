import axios from "axios";

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>();

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

      // Create new request and cache it
      const requestPromise = axios.get(cacheKey, {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }).then(response => {
        // Remove from cache after completion
        requestCache.delete(cacheKey);
        return response.data;
      }).catch(error => {
        // Remove from cache on error
        requestCache.delete(cacheKey);
        throw error;
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