import axios from "axios";

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

      const response = await axios.get(`${baseUrl}/api/${pathWithLocale}`, {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });
      return response.data;
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