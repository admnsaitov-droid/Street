/**
 * Formats a date string from "YYYY-MM-DD" format to "DD MMM, YYYY" format
 * @param dateString - Date string in "YYYY-MM-DD" format
 * @returns Formatted date string like "30 aug, 2025"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString);
    return '';
  }
  
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const year = date.getFullYear();
  
  return `${day} ${month}, ${year}`;
};

/**
 * Formats a date string with custom locale
 * @param dateString - Date string in "YYYY-MM-DD" format
 * @param locale - Locale string (e.g., 'en-US', 'es-ES')
 * @returns Formatted date string
 */
export const formatDateWithLocale = (dateString: string, locale: string = 'en-US'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString);
    return '';
  }
  
  const day = date.getDate();
  const month = date.toLocaleDateString(locale, { month: 'short' }).toLowerCase();
  const year = date.getFullYear();
  
  return `${day} ${month}, ${year}`;
}; 