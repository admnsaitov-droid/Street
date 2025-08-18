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
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting strapi data:', error);
      throw error;
    }
};

const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        // Server-side
        return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }
    // Client-side
    return window.location.origin;
};